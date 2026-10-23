import React, { useState, useRef, useEffect } from 'react';
import { Pencil, RotateCcw, CheckCircle2, ArrowLeft, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function PentaMindCanvasModule({ onSessionComplete, apiUrl, selectedLanguage = 'as', t }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [drawingType, setDrawingType] = useState('intersecting_pentagons'); // 'intersecting_pentagons' | 'clock_face'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brushColor, setBrushColor] = useState('#1E293B');

  // Instructional prompts
  const INSTRUCTIONS = {
    intersecting_pentagons: {
      as: 'ককা, তলৰ বাকচটোত সোমাই থকা দুটা পঞ্চভুজৰ (পাঁচকোণীয়া আকৃতি) দৰে হাত বুলাই আঁকক। কোনো খৰখেদা নাই।',
      bn: 'দাদু, নিচের বাক্সে একটির ভেতর আরেকটি ঢুকে থাকা দুটি পাঁচকোণা ঘরের ছবি সুন্দর করে আঁকুন। ধীরেসুস্থে আঁকুন।',
      ne: 'बाजे, तलको ठाउँमा दुईवटा पाँचकुने आकारहरू जोडेर बिस्तारै चित्र कोर्नुहोस्। कुनै हतार छैन।',
      en: 'Take your time and gently draw two intersecting pentagons (5-sided shapes) connected together, like the template above.'
    },
    clock_face: {
      as: 'ঘড়ীৰ ঘূৰণীয়া বৃত্তটো আঁকি তাত সময় নিৰ্দেশক কাঁটাদাল আঁকক।',
      bn: 'ঘড়ির গোল চাকাটি এঁকে সেখানে সময় নির্দেশক কাঁটাগুলি আঁকুন।',
      ne: 'घडीको गोलो घेरा बनाएर त्यसमा सुईहरू बिस्तारै कोर्नुहोस्।',
      en: 'Draw a calm circle for a clock face and place the numbers and hands indicating tea time (4:00).'
    }
  };

  const currentInstruction = INSTRUCTIONS[drawingType][selectedLanguage] || INSTRUCTIONS[drawingType].en;

  useEffect(() => {
    speechService.speak(currentInstruction, selectedLanguage);
    return () => {
      speechService.stop();
    };
  }, [drawingType, selectedLanguage]);

  // Setup Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
  }, []);

  const redrawAll = (allStrokes) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allStrokes.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke[0]?.color || '#1E293B';
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const newPt = { x, y, color: brushColor, time: Date.now() };
    setCurrentStroke([newPt]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.strokeStyle = brushColor;
    ctx.beginPath();
    const lastPt = currentStroke[currentStroke.length - 1];
    if (lastPt) {
      ctx.moveTo(lastPt.x, lastPt.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setCurrentStroke(prev => [...prev, { x, y, color: brushColor, time: Date.now() }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke([]);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStrokes([]);
    setAnalysisResult(null);
  };

  const handleUndo = () => {
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    redrawAll(updated);
  };

  const handleSubmit = async () => {
    if (strokes.length === 0) return;
    setIsAnalyzing(true);
    speechService.stop();

    try {
      const res = await fetch(`${apiUrl}/api/drawing/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strokeData: strokes,
          drawingType,
          canvasWidth: 600,
          canvasHeight: 400
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        const praise = selectedLanguage === 'as'
          ? 'বৰ ধুনীয়াকৈ আঁকিলে ককা! আপোনাৰ হাতৰ পৰশ আৰু স্থিৰতা অতি সুন্দৰ।'
          : 'Wonderfully drawn, Koka! Your steady hand and spatial balance are splendid.';
        speechService.speak(praise, selectedLanguage);
      }
    } catch (err) {
      console.warn('Drawing analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinish = () => {
    speechService.stop();
    if (onSessionComplete) {
      onSessionComplete({
        module: 'pentamind_drawing',
        completedAt: new Date()
      });
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        background: '#FFFFFF',
        padding: '1.25rem 2rem',
        borderRadius: '24px',
        border: '3px solid #DDD6FE',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
          }}>
            ✏️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                PentaMind Visuospatial Canvas (ৰেখা আৰু আকৃতি)
              </h1>
              <span style={{
                background: '#F5F3FF',
                color: '#6D28D9',
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '100px',
                border: '1px solid #DDD6FE'
              }}>
                PentaMind MMSE Research Inspired
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Gentle shape drawing predicting visuospatial preservation without clinical test anxiety.
            </p>
          </div>
        </div>

        <button
          onClick={handleFinish}
          style={{
            background: '#F3F4F6',
            color: '#374151',
            border: '2px solid #E5E7EB',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={18} />
          {t?.backToMenu || 'Back to Menu'}
        </button>
      </div>

      {/* Main Drawing Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Canvas Area */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '3px solid #DDD6FE',
          padding: '1.5rem',
          boxShadow: '0 8px 30px rgba(124, 58, 237, 0.08)'
        }}>
          {/* Target Visual Prompt Template */}
          <div style={{
            background: '#FAF5FF',
            border: '2px dashed #C4B5FD',
            borderRadius: '18px',
            padding: '12px 18px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Target Intersecting Pentagon Graphic */}
              <div style={{
                width: '70px',
                height: '50px',
                border: '2px solid #7C3AED',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                background: '#FFFFFF'
              }}>
                ⬟⬟
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#6D28D9' }}>Target Pattern</span>
                <p style={{ fontSize: '15px', color: '#4C1D95', fontWeight: '600', margin: '2px 0 0 0' }}>
                  {currentInstruction}
                </p>
              </div>
            </div>

            <button
              onClick={() => speechService.speak(currentInstruction, selectedLanguage)}
              style={{
                background: '#EDE9FE',
                color: '#6D28D9',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Listen instruction aloud"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Interactive Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={580}
            height={360}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              width: '100%',
              height: '360px',
              background: '#FAFAFA',
              border: '2px solid #E2E8F0',
              borderRadius: '20px',
              cursor: 'crosshair',
              touchAction: 'none',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)'
            }}
          />

          {/* Canvas Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #F1F5F9'
          }}>
            {/* Color Palette */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {['#1E293B', '#7C3AED', '#D97706', '#059669'].map(c => (
                <button
                  key={c}
                  onClick={() => setBrushColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: brushColor === c ? '3px solid #FFFFFF' : '2px solid #E2E8F0',
                    outline: brushColor === c ? `2px solid ${c}` : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Undo Last Stroke
              </button>

              <button
                onClick={handleClear}
                style={{
                  background: '#FEE2E2',
                  color: '#991B1B',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>

              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || strokes.length === 0}
                style={{
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
              >
                <CheckCircle2 size={16} />
                {isAnalyzing ? 'Analyzing...' : 'Complete & Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Celebratory Feedback & Visuospatial Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {analysisResult ? (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '3px solid #BBF7D0',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '1rem'
              }}>
                ✨
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#065F46', margin: '0 0 8px 0' }}>
                Splendid Visuospatial Drawing!
              </h3>
              <p style={{ fontSize: '15px', color: '#166534', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                {analysisResult.metrics?.clinicalSignificance}
              </p>

              <div style={{
                background: '#F0FDF4',
                borderRadius: '16px',
                border: '1.5px solid #86EFAC',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '13px',
                color: '#166534'
              }}>
                <div>
                  <span style={{ color: '#047857' }}>Symmetry Score:</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: '800', fontSize: '18px' }}>
                    {analysisResult.metrics?.symmetryScore}%
                  </p>
                </div>
                <div>
                  <span style={{ color: '#047857' }}>Integrity:</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: '800', fontSize: '14px' }}>
                    Optimal
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid var(--border-color)',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>
                How this activity supports your mind
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                Drawing intersecting shapes and simple clock faces helps stimulate motor coordination and visuospatial pathways.
              </p>
              <div style={{
                background: '#F8FAFC',
                padding: '12px 14px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
                color: '#475569'
              }}>
                <ShieldCheck size={20} color="#059669" />
                <span>Zero failing marks or stress. Everything you draw is valued and celebrated.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
