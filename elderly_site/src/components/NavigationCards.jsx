import React from 'react';
import { Heart, Hash, FileText, Eye, CheckCircle2, Sparkles, ArrowRight, Compass, Grid2X2, Pencil, Video, Search, Music, CheckSquare } from 'lucide-react';

export default function NavigationCards({ onSelectModule, t }) {
  const mods = t?.modules || {};

  const modules = [
    {
      id: 'family_recall',
      title: mods.family_recall?.title || 'Family Memory Lane',
      subtitle: mods.family_recall?.subtitle || 'See loved ones, remember cherished moments, and listen to warm family stories.',
      badge: mods.family_recall?.badge || 'Face & Story Recall',
      icon: Heart,
      iconColor: '#DC2626',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA'
    },
    {
      id: 'number_sequence',
      title: mods.number_sequence?.title || 'Number Sequence Memory',
      subtitle: mods.number_sequence?.subtitle || 'Memorize the calm sequence of numbers and tap them back in the same order.',
      badge: mods.number_sequence?.badge || 'Digit Memory (Levels 1-4)',
      icon: Hash,
      iconColor: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    },
    {
      id: 'word_puzzle',
      title: mods.word_puzzle?.title || 'Word & Memory Puzzle',
      subtitle: mods.word_puzzle?.subtitle || 'Spell favorite places, family names, and routines with gentle tiered hints.',
      badge: mods.word_puzzle?.badge || 'Tiered Gentle Hints',
      icon: FileText,
      iconColor: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE'
    },
    {
      id: 'picture_match',
      title: mods.picture_match?.title || 'Match the First Picture',
      subtitle: mods.picture_match?.subtitle || 'Look at the target cultural picture and choose the matching one from the cards.',
      badge: mods.picture_match?.badge || 'Visual Recognition',
      icon: Eye,
      iconColor: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0'
    },
    {
      id: 'cultural_reminiscence',
      title: mods.cultural_reminiscence?.title || 'Heritage Journey',
      subtitle: mods.cultural_reminiscence?.subtitle || 'Nostalgic memories of Rongali Bihu, tea gardens, Majuli Satras, and the Brahmaputra.',
      badge: mods.cultural_reminiscence?.badge || 'Cultural Reminiscence',
      icon: Compass,
      iconColor: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD'
    },
    {
      id: 'daily_routine',
      title: mods.daily_routine?.title || 'Daily Routines',
      subtitle: mods.daily_routine?.subtitle || 'Step-by-step gentle companion for your morning tea, veranda walk, and daily wellness.',
      badge: mods.daily_routine?.badge || 'Guided Routines',
      icon: CheckCircle2,
      iconColor: '#10B981',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0'
    },
    {
      id: 'storytelling',
      title: mods.storytelling?.title || 'Folk Stories & Travel Diaries',
      subtitle: mods.storytelling?.subtitle || 'Immerse in beloved folk tales, river journeys, and test your story memory.',
      badge: mods.storytelling?.badge || 'Storytelling & Recall',
      icon: Sparkles,
      iconColor: '#4F46E5',
      bgColor: '#EEF2FF',
      borderColor: '#C7D2FE'
    },
    {
      id: 'vr_memory',
      title: mods.vr_memory?.title || 'Personalized VR Memory Experience',
      subtitle: mods.vr_memory?.subtitle || 'Immerse in your personal family memories, cherished hometowns, and joyful moments in a calm 3D space.',
      badge: mods.vr_memory?.badge || 'Spatial VR & Voice Memory',
      icon: Eye,
      iconColor: '#0891B2',
      bgColor: '#ECFEFF',
      borderColor: '#A5F3FC'
    },
    {
      id: 'memory_match',
      title: mods.memory_match?.title || 'Memory Match',
      subtitle: mods.memory_match?.subtitle || 'Flip cards to find matching pairs. Use your working memory to recall positions and clear the board.',
      badge: mods.memory_match?.badge || 'Card Pairs',
      icon: Grid2X2,
      iconColor: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    },
    {
      id: 'visual_sequence',
      title: mods.visual_sequence?.title || 'Visual Sequence Recall',
      subtitle: mods.visual_sequence?.subtitle || 'Watch a sequence of symbols, then recall the exact order from multiple choices.',
      badge: mods.visual_sequence?.badge || 'Pattern Memory',
      icon: Eye,
      iconColor: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE'
    },
    {
      id: 'ai_pet',
      title: mods.ai_pet?.title || 'Moti — AI Gentle Pet Companion (মোতি)',
      subtitle: mods.ai_pet?.subtitle || 'Stroke, pet, and talk to your loyal golden companion. Enjoy calm rhythmic breathing and warm reassurance.',
      badge: mods.ai_pet?.badge || 'Pawyaya Inspired • Tactile & Calm',
      icon: Heart,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A'
    },
    {
      id: 'heirloom_scanner',
      title: mods.heirloom_scanner?.title || 'Heirloom & Keepsake Scanner (স্মৃতিৰ বাতি)',
      subtitle: mods.heirloom_scanner?.subtitle || 'Touch or scan family brass cups, wedding gamusas, and radios to listen to verified oral history.',
      badge: mods.heirloom_scanner?.badge || 'Meeshaim M. Inspired • Object Recall',
      icon: Sparkles,
      iconColor: '#0284C7',
      bgColor: '#E0F2FE',
      borderColor: '#BAE6FD'
    },
    {
      id: 'family_board',
      title: mods.family_board?.title || 'WellRemember Family Board (মৰমৰ চিঠি)',
      subtitle: mods.family_board?.subtitle || 'Listen to warm voice greetings and see heartfelt photo cards sent by your loved ones across India.',
      badge: mods.family_board?.badge || 'WellRememberBoard Inspired • Live Postcards',
      icon: Heart,
      iconColor: '#E11D48',
      bgColor: '#FFE4E6',
      borderColor: '#FECDD3'
    },
    {
      id: 'pentamind_drawing',
      title: mods.pentamind_drawing?.title || 'PentaMind Visuospatial Drawing (চিত্ৰ অংকন)',
      subtitle: mods.pentamind_drawing?.subtitle || 'Gently trace and draw intersecting pentagons and clock faces with calm strokes. Clinical vector scoring.',
      badge: mods.pentamind_drawing?.badge || 'PentaMind Research • Visuospatial Drawing',
      icon: Pencil,
      iconColor: '#8B5CF6',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE'
    },
    {
      id: 'virtual_presence',
      title: mods.virtual_presence?.title || 'Family Virtual Presence Room (পৰিয়ালৰ মুখনি)',
      subtitle: mods.virtual_presence?.subtitle || 'See familiar video greetings from Deepak in Golaghat and Maina in Bangalore whenever you need comfort.',
      badge: mods.virtual_presence?.badge || 'Relief Inspired • Empathetic Companion Room',
      icon: Video,
      iconColor: '#DB2777',
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8'
    },
    {
      id: 'everyday_detective',
      title: mods.everyday_detective?.title || 'Everyday Detective (চিনাকি দৃশ্য)',
      subtitle: mods.everyday_detective?.subtitle || 'Explore familiar household scenes like the morning tea veranda and cozy kitchen to spot beloved items.',
      badge: mods.everyday_detective?.badge || 'Exclusive • Visual Attention & Everyday Association',
      icon: Eye,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A'
    },
    {
      id: 'sound_memory_quest',
      title: mods.sound_memory_quest?.title || 'Sound-to-Memory Quest (সুৰ আৰু স্মৃতি)',
      subtitle: mods.sound_memory_quest?.subtitle || 'Listen to authentic acoustic sounds—temple bells, monsoon rain on tin roofs, and tea garden train whistles.',
      badge: mods.sound_memory_quest?.badge || 'Exclusive • Auditory Attention & Reminiscence',
      icon: Compass,
      iconColor: '#0284C7',
      bgColor: '#E0F2FE',
      borderColor: '#BAE6FD'
    },
    {
      id: 'recipe_rebuilder',
      title: mods.recipe_rebuilder?.title || 'Recipe Rebuilder (পাকঘৰৰ সোৱাদ)',
      subtitle: mods.recipe_rebuilder?.subtitle || 'Recreate cherished recipes like Assam Red Tea step-by-step using visual cards and gentle guidance.',
      badge: mods.recipe_rebuilder?.badge || 'Exclusive • Procedural Recall & Sequencing',
      icon: CheckCircle2,
      iconColor: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0'
    },
    {
      id: 'garden_of_memories',
      title: mods.garden_of_memories?.title || 'Garden of Memories (স্মৃতিৰ ফুলনি)',
      subtitle: mods.garden_of_memories?.subtitle || 'Nurture your peaceful courtyard garden: choose orchids, marigolds, and sacred tulsi in a calm sanctuary.',
      badge: mods.garden_of_memories?.badge || 'Exclusive • Creative Choice & Sensory Sanctuary',
      icon: Heart,
      iconColor: '#EC4899',
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8'
    },
    {
      id: 'focus_peripheral',
      title: mods.focus_peripheral?.title || 'Focus & Peripheral Awareness (দৃষ্টিকেন্দ্ৰ আৰু চাৰিওফাল)',
      subtitle: mods.focus_peripheral?.subtitle || 'Gently rest your gaze on the central golden diya while noticing targets appearing in the outer corners.',
      badge: mods.focus_peripheral?.badge || 'Exclusive • Visual Attention & Periphery',
      icon: Eye,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A'
    },
    {
      id: 'focus_finder',
      title: mods.focus_finder?.title || 'Focus Finder (মনোযোগ সন্ধান)',
      subtitle: mods.focus_finder?.subtitle || 'Search illustrated domestic scenes like the tea veranda, kitchen, and courtyard to spot requested items.',
      badge: mods.focus_finder?.badge || 'Visual Search & Attention',
      icon: Search,
      iconColor: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    },
    {
      id: 'smriti_match_quest',
      title: mods.smriti_match_quest?.title || 'Smriti Match Quest (স্মৃতি মিলন)',
      subtitle: mods.smriti_match_quest?.subtitle || 'Purble Place-inspired matching with a grid of visible cards. Select a card, then find its identical twin.',
      badge: mods.smriti_match_quest?.badge || 'Visible Grid Discrimination',
      icon: CheckSquare,
      iconColor: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0'
    },
    {
      id: 'tune_memory',
      title: mods.tune_memory?.title || 'Tune Memory (সুৰ স্মৃতি)',
      subtitle: mods.tune_memory?.subtitle || 'Listen to authentic sounds—temple bells, flutes, and rain—and identify or recall the melodic order.',
      badge: mods.tune_memory?.badge || 'Auditory Sequencing & Recall',
      icon: Music,
      iconColor: '#DB2777',
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '36px', color: 'var(--text-main)', marginBottom: '8px' }}>
          {t?.menuHeader || 'Cognitive Memory & Cultural Activities'}
        </h2>
        <p style={{ fontSize: '24px', color: 'var(--text-muted)' }}>
          {t?.menuSub || 'Engage your mind with joyful nostalgia and gentle practice'}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '1.75rem'
      }}>
        {modules.map((m) => {
          const IconComp = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              style={{
                background: '#FFFFFF',
                border: `3px solid ${m.borderColor}`,
                borderRadius: '24px',
                padding: '1.75rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'var(--shadow-soft)',
                minHeight: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = m.borderColor;
                e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{
                    background: m.bgColor,
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={34} color={m.iconColor} />
                  </div>
                  <span style={{
                    background: m.bgColor,
                    color: m.iconColor,
                    fontSize: '15px',
                    fontWeight: '700',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: `1px solid ${m.borderColor}`
                  }}>
                    {m.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '26px', marginBottom: '8px', color: 'var(--text-main)' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '19px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {m.subtitle}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                color: 'var(--accent-amber)',
                fontWeight: '700',
                fontSize: '20px'
              }}>
                <span>{t?.open || 'Play & Explore'}</span>
                <ArrowRight size={22} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
