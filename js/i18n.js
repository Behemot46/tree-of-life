/* ═══════════════════════════════════════════════════════════════
   i18n.js — Internationalization: English, Hebrew, Russian
   ═══════════════════════════════════════════════════════════════ */

const I18n = (() => {
  let lang = localStorage.getItem('tol-lang') || 'en';

  const T = {
    en: {
      /* Navbar */
      app_title:          'Tree of Life',
      search_placeholder: 'Search species or clade…',
      btn_discover:       'Discover',
      btn_layout_radial:  'Radial layout',
      btn_layout_clado:   'Cladogram layout',
      btn_theme:          'Toggle theme',
      /* Legend */
      legend_title:       'Domains of Life',
      legend_hint:        'click to highlight',
      leg_bacteria:       'Bacteria',
      leg_archaea:        'Archaea',
      leg_plants:         'Plants',
      leg_fungi:          'Fungi',
      leg_animals:        'Animals',
      leg_protists:       'Protists',
      leg_extinct:        '† Extinct',
      /* Panel tabs */
      tab_overview:       'Overview',
      tab_evolution:      'Evolution',
      tab_gallery:        'Gallery',
      tab_science:        'Science',
      /* Panel sections */
      sec_lineage:        'Lineage',
      sec_divergence:     'Estimated Divergence Time',
      sec_relatives:      'Sister Groups',
      sec_sources:        'External Sources',
      sec_classification: 'Classification',
      sec_photos:         'Photos',
      /* Info card labels */
      lbl_rank:           'Rank',
      lbl_species:        'Species',
      lbl_divergence:     'Divergence',
      lbl_observations:   'Observations',
      lbl_sci_name:       'Scientific name',
      lbl_ott_id:         'OTT ID',
      lbl_iucn:           'IUCN Status',
      lbl_inat_obs:       'iNat observations',
      lbl_status:         'Status',
      unit_mya:           'million years ago',
      unit_inat:          'iNat records',
      unit_approx:        'approx.',
      /* Gallery */
      gallery_empty:      'No photos available.',
      gallery_source:     'Photos from iNaturalist community',
      no_desc:            'No description available for this taxon.',
      /* Timeline */
      timeline_label:     'Geological Timeline',
      /* Loading */
      loading_text:       'Loading Tree of Life…',
      loading_sub:        'Connecting to Open Tree of Life database',
      /* Misc */
      extinct_label:      'Extinct',
      no_image:           'No image available',
    },

    he: {
      app_title:          'עץ החיים',
      search_placeholder: 'חיפוש מין או קבוצה...',
      btn_discover:       'גלה',
      btn_layout_radial:  'פריסה רדיאלית',
      btn_layout_clado:   'קלדוגרמה',
      btn_theme:          'החלף ערכת נושא',
      legend_title:       'תחומי החיים',
      legend_hint:        'לחץ להדגשה',
      leg_bacteria:       'בקטריות',
      leg_archaea:        'ארכאות',
      leg_plants:         'צמחים',
      leg_fungi:          'פטריות',
      leg_animals:        'בעלי חיים',
      leg_protists:       'פרוטיסטות',
      leg_extinct:        '† נכחד',
      tab_overview:       'סקירה',
      tab_evolution:      'אבולוציה',
      tab_gallery:        'גלריה',
      tab_science:        'מדע',
      sec_lineage:        'שושלת',
      sec_divergence:     'זמן פיצול משוער',
      sec_relatives:      'קבוצות אחיות',
      sec_sources:        'מקורות חיצוניים',
      sec_classification: 'סיווג',
      sec_photos:         'תמונות',
      lbl_rank:           'דרגה',
      lbl_species:        'מינים',
      lbl_divergence:     'פיצול',
      lbl_observations:   'תצפיות',
      lbl_sci_name:       'שם מדעי',
      lbl_ott_id:         'מזהה OTT',
      lbl_iucn:           'סטטוס IUCN',
      lbl_inat_obs:       'תצפיות iNaturalist',
      lbl_status:         'סטטוס',
      unit_mya:           'מיליון שנה לפנה"ס',
      unit_inat:          'רשומות iNat',
      unit_approx:        'בקירוב',
      gallery_empty:      'אין תמונות זמינות.',
      gallery_source:     'תמונות מקהילת iNaturalist',
      no_desc:            'אין תיאור זמין עבור טקסון זה.',
      timeline_label:     'ציר הזמן הגיאולוגי',
      loading_text:       'טוען את עץ החיים...',
      loading_sub:        'מתחבר למסד נתוני Open Tree of Life',
      extinct_label:      'נכחד',
      no_image:           'אין תמונה זמינה',
    },

    ru: {
      app_title:          'Дерево жизни',
      search_placeholder: 'Поиск вида или клады…',
      btn_discover:       'Открыть',
      btn_layout_radial:  'Радиальная схема',
      btn_layout_clado:   'Кладограмма',
      btn_theme:          'Сменить тему',
      legend_title:       'Домены жизни',
      legend_hint:        'нажмите для выделения',
      leg_bacteria:       'Бактерии',
      leg_archaea:        'Археи',
      leg_plants:         'Растения',
      leg_fungi:          'Грибы',
      leg_animals:        'Животные',
      leg_protists:       'Протисты',
      leg_extinct:        '† Вымершие',
      tab_overview:       'Обзор',
      tab_evolution:      'Эволюция',
      tab_gallery:        'Галерея',
      tab_science:        'Наука',
      sec_lineage:        'Родословная',
      sec_divergence:     'Время дивергенции',
      sec_relatives:      'Сестринские группы',
      sec_sources:        'Внешние источники',
      sec_classification: 'Классификация',
      sec_photos:         'Фотографии',
      lbl_rank:           'Ранг',
      lbl_species:        'Видов',
      lbl_divergence:     'Дивергенция',
      lbl_observations:   'Наблюдений',
      lbl_sci_name:       'Научное название',
      lbl_ott_id:         'OTT ID',
      lbl_iucn:           'Статус МСОП',
      lbl_inat_obs:       'Наблюдения iNat',
      lbl_status:         'Статус',
      unit_mya:           'млн лет назад',
      unit_inat:          'записей iNat',
      unit_approx:        'прибл.',
      gallery_empty:      'Фотографии недоступны.',
      gallery_source:     'Фото из сообщества iNaturalist',
      no_desc:            'Описание для этого таксона недоступно.',
      timeline_label:     'Геологическая шкала времени',
      loading_text:       'Загрузка Дерева жизни…',
      loading_sub:        'Подключение к базе данных Open Tree of Life',
      extinct_label:      'Вымерший',
      no_image:           'Изображение отсутствует',
    }
  };

  /* Return translation for key; fall back to English */
  function t(key) {
    return (T[lang] && T[lang][key]) || T.en[key] || key;
  }

  /* Apply all data-i18n attributes in the DOM */
  function applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.tagName === 'INPUT') {
        el.placeholder = t(key);
      } else if (el.dataset.i18nAttr) {
        el.setAttribute(el.dataset.i18nAttr, t(key));
      } else {
        el.textContent = t(key);
      }
    });
  }

  /* Set language, persist, apply translations, handle RTL */
  function setLang(newLang) {
    if (!T[newLang]) return;
    lang = newLang;
    localStorage.setItem('tol-lang', lang);

    // RTL for Hebrew
    document.documentElement.dir  = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Apply to DOM
    applyAll();

    // Update search placeholder specifically (input placeholder needs special handling)
    const si = document.getElementById('search-input');
    if (si) si.placeholder = t('search_placeholder');
  }

  function currentLang() { return lang; }

  return { t, setLang, applyAll, currentLang };
})();
