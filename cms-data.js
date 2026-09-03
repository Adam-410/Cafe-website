/**
 * Masalsı Café — Content Management System Data Layer
 * Handles data persistence (localStorage), default content, and synchronization.
 */

'use strict';

const STORAGE_KEY = 'masalsi_cafe_cms_data';
const AUTH_KEY = 'masalsi_admin_auth';

// 100% of existing website content as defaults
const DEFAULT_SITE_DATA = {
  hero: {
    eyebrow: 'Mahallenizin Kalbinde',
    titleMain: 'Bir Yudum',
    titleAccent: 'Hikâye',
    tagline: 'Her fincan bir sohbetin, her pastane köşesi bir anının başlangıcıdır.',
    bgImage: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnJ9S7smkgrRMJrkt8fzlPirFh90OXg71FbX5zwAputXLIVhLIwk9bKQoSgu5akudyEGbfLjv4K6jd09V4410iItPMKXluBFtHMOgBMcvKld3w4XxfQi6Grk1n81-VGSJHxVNQ=s1360-w1360-h1020-rw',
    badgeText: 'Taze & El Yapımı'
  },
  about: {
    eyebrow: 'Hikâyemiz',
    headingMain: 'Sadece Kahve Değil,',
    headingAccent: 'Bir Sığınak',
    paragraphs: [
      'Masalsı Café, şehrin koşturmacasından uzaklaşıp ev sıcaklığında bir mola vermek isteyenler için kapılarını açtı. Ferah oturma alanları, sakin atmosferi ve güler yüzlü hizmet anlayışıyla kısa sürede dost meclislerinin, gençlerin ve ailelerin keyifle buluştuğu samimi bir köşeye dönüştü.',
      'Menümüzde el yapımı geleneksel tarifleri taze ve kaliteli malzemelerle buluşturuyoruz; özenle hazırlanan mantı, sarma ve sıcak böreklerimizden günlük çıkan tatlı çeşitlerimize kadar her tabağa ayrı bir titizlik gösteriyoruz. Taze demlenen tavşan kanı çayımız ve geleneksel kahvelerimiz eşliğinde masanıza keyif katıyoruz.',
      'İster kitabınızı alıp kafa dinleyin, ister sevdiklerinizle saatlerce süren keyifli sohbetlere dalın; Masalsı Café\'de zaman telaşsız, ortam her zaman sıcacıktır.'
    ],
    badgeYear: "2019'dan beri",
    badgeLabel: 'sizinleyiz',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlLf8ETbnNIoo5SN8nJKY2KchfHHwQJAGDak-XulX-gXjhtV3AD53oJpdRehVNrdY05oEKyY5FTICz7msxVUhUZvGrGA6lGbif5nbrxhiGWuOGvijhVkaqR22pc2JeU19za_bNB=s1360-w1360-h1020-rw'
  },
  menu: [
    // SICAK İÇECEKLER
    {
      id: 'item-cay',
      name: 'Çay',
      price: '₺30',
      desc: 'İnce belli bardakta taze demleme çay.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-turk-kahvesi',
      name: 'Türk Kahvesi',
      price: '₺100',
      desc: 'Geleneksel cezvede pişirilir. Aromalı seçenekler: Çilekli, Damla Sakızlı.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: 'Geleneksel',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-filtre-kahve',
      name: 'Filtre Kahve',
      price: '₺100',
      desc: 'Yavaş demleme, zengin ve dengeli aroma.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-menengic',
      name: 'Menengiç Kahvesi',
      price: '₺110',
      desc: "Güneydoğu'nun geleneksel yabani fıstık kahvesi.",
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: 'Özel',
      image: 'https://images.unsplash.com/photo-1610889556528-9a770e32644f?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-salep',
      name: 'Salep',
      price: '₺110',
      desc: 'Geleneksel kıvamında, tarçın eşliğinde sıcak servis.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-sicak-cikolata',
      name: 'Sıcak Çikolata',
      price: '₺110',
      desc: 'Yoğun kakaolu ve kadifemsi kıvamlı sıcak çikolata.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-bitki-cayi',
      name: 'Bitki Çayı',
      price: '₺60',
      desc: 'Ihlamur, adaçayı, yeşil çay, papatya ve nane-limon seçenekleri.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-nescafe',
      name: 'Nescafe',
      price: '₺70',
      desc: 'Klasik veya sütlü köpüklü sıcak kahve.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-oralet',
      name: 'Oralet',
      price: '₺40',
      desc: 'Portakal ve kivi aromalı nostaljik sıcak içecek.',
      mainCategory: 'drinks',
      subCategory: 'sicak',
      tag: '',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=80'
    },

    // SOĞUK İÇECEKLER
    {
      id: 'item-limonata',
      name: 'Limonata',
      price: '₺120',
      desc: 'Taze sıkılmış limon ve taze nane ile ev yapımı lezzet.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: 'Taze',
      image: 'https://images.unsplash.com/photo-1523371067569-533036427387?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-churchill',
      name: 'Churchill',
      price: '₺110',
      desc: 'Maden suyu, taze limon suyu ve özel tuz dengesiyle.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-kutu-icecekler',
      name: 'Pepsi / Yedigün / Ice Tea',
      price: '₺70',
      desc: 'Soğuk servis edilen kutu meşrubat çeşitleri.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-sise-gazoz',
      name: 'Şişe Gazoz',
      price: '₺60',
      desc: 'Klasik cam şişe ferahlatıcı gazoz.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-ayran',
      name: 'Ayran',
      price: '₺60',
      desc: 'Geleneksel soğuk ve ferahlatıcı yoğurt içeceği.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-sade-soda',
      name: 'Sade Soda',
      price: '₺40',
      desc: 'Doğal mineralli soğuk maden suyu.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-meyveli-soda',
      name: 'Meyveli Soda',
      price: '₺50',
      desc: 'Limon, elma ve karpuz-çilek aromalı soda seçenekleri.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-redbull',
      name: 'Red Bull',
      price: '₺120',
      desc: 'Orijinal enerji içeceği.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-black-bruin',
      name: 'Black Bruin',
      price: '₺80',
      desc: 'Soğuk enerji içeceği.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-meyve-suyu',
      name: 'Meyve Suyu',
      price: '₺70',
      desc: 'Şeftali, vişne ve karışık meyve suyu seçenekleri.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-su',
      name: 'Su',
      price: '₺20',
      desc: 'Şişe doğal kaynak suyu.',
      mainCategory: 'drinks',
      subCategory: 'soguk',
      tag: '',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300&auto=format&fit=crop&q=80'
    },

    // PASTALAR
    {
      id: 'item-cheesecake',
      name: 'Cheesecake',
      price: '₺150',
      desc: 'Limonlu ve Frambuazlı seçenekleriyle fırınlanmış kıvam.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: 'Favori',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-tiramisu',
      name: 'Tiramisu',
      price: '₺160',
      desc: 'İtalyan klasiği, espresso ve maskarpone kreması ile.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-sufle',
      name: 'Sufle',
      price: '₺200',
      desc: 'Fırından sıcak servis, akışkan bitter çikolata dolgulu.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: 'Sıcak',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-fistik-dunyasi',
      name: 'Fıstık Dünyası',
      price: '₺200',
      desc: 'Bol Antep fıstığı dolgulu özel krema katmanları.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: 'Özel',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-profiterol-pasta',
      name: 'Dark Profiterollü Pasta',
      price: '₺200',
      desc: 'Bitter çikolata soslu profiterol topları ile süslenmiş pasta.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-orman-meyveli',
      name: 'Orman Meyveli Pasta',
      price: '₺180',
      desc: 'Taze orman meyveleri ve hafif krema dolgusu.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-yaban-mersinli',
      name: 'Yaban Mersinli Pasta',
      price: '₺180',
      desc: 'Taze yaban mersini taneleriyle hafif ve ferah lezzet.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-mozaik-pasta',
      name: 'Mozaik Pasta',
      price: '₺160',
      desc: 'Geleneksel bisküvili ve yoğun kakaolu ev yapımı pasta.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-fistikli-doro',
      name: 'Albenili Fıstıklı Doro',
      price: '₺200',
      desc: 'Fıstıklı ve karamelli özel Doro tarifi.',
      mainCategory: 'food',
      subCategory: 'pastalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80'
    },

    // EV YEMEKLERİ
    {
      id: 'item-yoresel-tabak',
      name: 'Yöresel Lezzet Tabağı',
      price: '₺300',
      desc: '1 İçli Köfte, 8 Yaprak Sarma, Mantı ve 1 Börek bir arada.',
      mainCategory: 'food',
      subCategory: 'evyemekleri',
      tag: 'Önerilen',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-manti',
      name: 'Mantı',
      price: '₺200',
      desc: 'El açması ev mantısı, sarımsaklı yoğurt ve tereyağlı sos ile.',
      mainCategory: 'food',
      subCategory: 'evyemekleri',
      tag: 'Ev Yapımı',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-sarma',
      name: 'Sarma Tabağı',
      price: '₺200',
      desc: '16 adet zeytinyağlı taze asma yaprağı sarması.',
      mainCategory: 'food',
      subCategory: 'evyemekleri',
      tag: '',
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-icli-kofte',
      name: 'İçli Köfte',
      price: '₺70',
      desc: 'Adet fiyatıdır. İnce bulgur kabuğu, kıymalı ve cevizli iç harç.',
      mainCategory: 'food',
      subCategory: 'evyemekleri',
      tag: '',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-gul-borek',
      name: 'Patatesli Gül Börek',
      price: '₺80',
      desc: 'Adet fiyatıdır. El açması çıtır yufka ve baharatlı patates harcı.',
      mainCategory: 'food',
      subCategory: 'evyemekleri',
      tag: '',
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-tepsi-boregi',
      name: 'Peynirli Tepsi Böreği',
      price: '₺70',
      desc: 'Adet fiyatıdır. Fırından taze çıkan bol peynirli tepsi böreği.',
      mainCategory: 'food',
      subCategory: 'evyemekleri',
      tag: '',
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=300&auto=format&fit=crop&q=80'
    },

    // TOSTLAR
    {
      id: 'item-tost-kavurmali',
      name: 'Tam Kavurmalı Kaşarlı Tost',
      price: '₺210',
      desc: 'Özel et kavurma ve erimiş kaşar peyniriyle sıcak preslenmiş tam ekmek.',
      mainCategory: 'food',
      subCategory: 'tostlar',
      tag: 'Popüler',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-tost-karisik',
      name: 'Tam Karışık Tost',
      price: '₺200',
      desc: 'Sucuk, kaşar peyniri ve baharatlı sos ile tam ekmek doyurucu tost.',
      mainCategory: 'food',
      subCategory: 'tostlar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-tost-sucuklu',
      name: 'Tam Sucuklu Tost',
      price: '₺160',
      desc: 'Baharatlı sucuk ve erimiş kaşar peynirli tam ekmek tost.',
      mainCategory: 'food',
      subCategory: 'tostlar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-tost-kasarli',
      name: 'Tam Kaşarlı Tost',
      price: '₺150',
      desc: 'Bol erimiş kaşar peyniri ve tereyağı ile tam ekmek tost.',
      mainCategory: 'food',
      subCategory: 'tostlar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80'
    },

    // MENEMENLER
    {
      id: 'item-menemen-kavurmali',
      name: 'Kavurmalı Menemen',
      price: '₺210',
      desc: 'Özel et kavurma, domates, yeşil biber ve sahanda yumurta.',
      mainCategory: 'food',
      subCategory: 'menemenler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-menemen-kiymali',
      name: 'Kıymalı Menemen',
      price: '₺200',
      desc: 'Kavrulmuş kıyma, domates, taze biber ve yumurta.',
      mainCategory: 'food',
      subCategory: 'menemenler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-menemen-karisik',
      name: 'Karışık Menemen',
      price: '₺190',
      desc: 'Sucuk ve erimiş kaşar peyniri eşliğinde tam kıvamında menemen.',
      mainCategory: 'food',
      subCategory: 'menemenler',
      tag: 'Favori',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-menemen-sucuklu',
      name: 'Sucuklu Menemen',
      price: '₺160',
      desc: 'Baharatlı sucuk dilimleri ve taze sebzeler ile hazırlanır.',
      mainCategory: 'food',
      subCategory: 'menemenler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-menemen-kasarli',
      name: 'Kaşarlı Menemen',
      price: '₺150',
      desc: 'Üzerine bol erimiş taze kaşar peyniri ilavesi ile.',
      mainCategory: 'food',
      subCategory: 'menemenler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-menemen-sade',
      name: 'Sade Menemen',
      price: '₺140',
      desc: 'Taze domates, biber ve yumurta ile pişirilen klasik menemen.',
      mainCategory: 'food',
      subCategory: 'menemenler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
    },

    // YUMURTALAR
    {
      id: 'item-yumurta-kavurmali',
      name: 'Kavurmalı Yumurta',
      price: '₺180',
      desc: 'Tereyağında sotelenmiş kavurma üzerine sahanda yumurta.',
      mainCategory: 'food',
      subCategory: 'yumurtalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-yumurta-kiymali',
      name: 'Kıymalı Yumurta',
      price: '₺160',
      desc: 'Baharatlı kıyma harcı ile sahanda pişirilen yumurta.',
      mainCategory: 'food',
      subCategory: 'yumurtalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-yumurta-sucuklu',
      name: 'Sucuklu Yumurta',
      price: '₺130',
      desc: 'Tavada kızartılmış kasap sucuğu ve sahanda yumurta.',
      mainCategory: 'food',
      subCategory: 'yumurtalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-yumurta-kasarli',
      name: 'Kaşarlı Yumurta',
      price: '₺110',
      desc: 'Erimiş kaşar peyniri eşliğinde sahanda yumurta veya omlet.',
      mainCategory: 'food',
      subCategory: 'yumurtalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-yumurta-sade',
      name: 'Sade Yumurta',
      price: '₺100',
      desc: 'Sahanda tereyağlı, haşlanmış veya sade omlet seçeneği.',
      mainCategory: 'food',
      subCategory: 'yumurtalar',
      tag: '',
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=300&auto=format&fit=crop&q=80'
    },

    // DÖNER & FAST FOOD
    {
      id: 'item-tavuk-menu',
      name: 'Tavuk Menü',
      price: '₺230',
      desc: 'Sandviç ekmeğinde tavuk döner, yanında patates kızartması ve ayran.',
      mainCategory: 'food',
      subCategory: 'donerler',
      tag: 'Menü',
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-kofte-tabagi',
      name: 'Köfte Tabağı',
      price: '₺260',
      desc: '4 adet Sivas köftesi, patates kızartması, ızgara domates ve biber ile.',
      mainCategory: 'food',
      subCategory: 'donerler',
      tag: 'Özel',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-kofte-ekmek',
      name: 'Köfte Ekmek',
      price: '₺230',
      desc: '3 adet Sivas köftesi, domates, yeşil biber ve soğan ile ekmek arası.',
      mainCategory: 'food',
      subCategory: 'donerler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-tavuk-burger',
      name: 'Tavuk Burger',
      price: '₺220',
      desc: 'Özel soslu çıtır tavuk fileto burger, yanında patates kızartması ile.',
      mainCategory: 'food',
      subCategory: 'donerler',
      tag: '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80'
    },

    // DİĞER LEZZETLER
    {
      id: 'item-kahvalti-tabagi',
      name: 'Kahvaltı Tabağı',
      price: '₺200',
      desc: 'Beyaz ve kaşar peyniri, zeytin, reçel, bal, tereyağı, domates ve yumurta.',
      mainCategory: 'food',
      subCategory: 'diger',
      tag: 'Zengin',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-atistirmalik-tabak',
      name: 'Atıştırmalık Tabağı',
      price: '₺200',
      desc: 'Çıtır patates kızartması, sosis, çıtır nugget ve soğan halkası sepeti.',
      mainCategory: 'food',
      subCategory: 'diger',
      tag: '',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'item-patates-kizartmasi',
      name: 'Patates Kızartması',
      price: '₺120',
      desc: 'Özel baharat harmanlı çıtır patates kızartması tabağı.',
      mainCategory: 'food',
      subCategory: 'diger',
      tag: '',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm8-Rrr8cue-LStUW9voXbdWGCe-KNh-E3OkKERylfpbwULueZz9UfqkHeb6jI7vDVFecu5KhH4ofD_mbOrqQq-Bdid-ZIGRdFaTothtyOP9QjqfBTx78cGd3RNidn4zMBTYgjw=s1360-w1360-h1020-rw',
      label: 'Masalsı Café iç mekan',
      span: 'normal'
    },
    {
      id: 'gal-2',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmfaaHr3MmPszwPhL95u--wwGdHbjnTV0Z6qyeGgL9OzCOJHoG4PJSZk1j5sW4puwPyac2V8OVSO3TQJocGDoSUu8X3iCufadbGpJiA7gXD_RC374SC90TnBVk-SDdTr3RQGU6kHQ=s1360-w1360-h1020-rw',
      label: 'Kahve servisi',
      span: 'normal'
    },
    {
      id: 'gal-3',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkRnRnVn1GGM9Q1LajXam6eSRh6gdWZWO-fpDxvcx2OZvD_I_N4yocSmKAqaxxS19GCodKrK6YYRnnitRUhtPJaZVInGW0l93Z810pltkGWc0di_EHaONSLcs7u1vskJAchLjg=s1360-w1360-h1020-rw',
      label: 'Filtre kahve hazırlanışı',
      span: 'tall'
    },
    {
      id: 'gal-4',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlPek28iuqB4M2KPgbuD5CtMppcLZPE8871gjpW4TBLOg4kPGTcY1kOo6lc3Zcsok4YgEmJvsRgyEN79xDiLuJ2doMkpfKn2P8SwA8yL7Nh8SMAuama-EBXjwSzneo6jP5vna8V=s1360-w1360-h1020-rw',
      label: 'Taze pişen pastane ürünleri',
      span: 'normal'
    },
    {
      id: 'gal-5',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnVG4VF-Qx9pQAE0VEIR_3sTRD0YISRwdKjCV5gYbxESKcLdns5tVFEQyu2Um8arEtHsAgKtDrtyhEQxSgorWrTu2jqJ_RYxevpLzWHGt-81fQ_d_x4JpPV7OUUgUtS8yLYMdw=s1360-w1360-h1020-rw',
      label: 'Müşteriler kahve içiyor',
      span: 'wide'
    },
    {
      id: 'gal-6',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkNJyD5dnyYhTfe19db90OT65rQq1deB8_msqpROMaW5X6GXDbxIK2LGCwV9boGE6uzTR0id5QLEmIoFATDl9EIO7nDB8P_D3EI6h67jG3M-hmgR-zpHUn_2c4ssWmT2vr0gFvgbA=s1360-w1360-h1020-rw',
      label: 'Latte art',
      span: 'normal'
    }
  ],
  contact: {
    address: 'Camiikebir Mah., Sivas Merkez\nSivas, Türkiye',
    phone: '(0346) 221 45 67',
    email: 'merhaba@masalsi.com',
    hours: [
      { days: 'Pazartesi – Cuma', time: '08:00 – 01:00' },
      { days: 'Cumartesi', time: '08:00 – 01:00' },
      { days: 'Pazar', time: '08:00 – 01:00' }
    ],
    directionsUrl: 'https://maps.google.com/?cid=13584856908244693712&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=TR&source=embed',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8676.966237564071!2d37.012153087135474!3d39.74479831000608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x407eab01a49678ed%3A0xbc871b61e46fb2d0!2sMasal\'s%C4%B1%20Cafe!5e0!3m2!1sen!2str!4v1787685398261!5m2!1sen!2str',
    instagram: 'https://www.instagram.com/masalsi_cafe/',
    facebook: 'https://www.facebook.com/p/Masals%C4%B1-Cafe-100088958484685/'
  },
  settings: {
    adminPin: '1234'
  }
};

/**
 * Retrieves current site data from localStorage or initializes with defaults.
 * @returns {object} Site data object
 */
function getSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSiteData(DEFAULT_SITE_DATA, false);
      return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    }
    const parsed = JSON.parse(raw);

    // Upgrade any old Unsplash placeholders in stored gallery to new default Google Photos
    let galleryList = Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_SITE_DATA.gallery;
    const oldUnsplashUrls = [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38',
      'https://images.unsplash.com/photo-1534778101976-62847782c213'
    ];
    galleryList = galleryList.map((item, idx) => {
      if (item.url && oldUnsplashUrls.some(u => item.url.startsWith(u))) {
        return {
          ...item,
          url: DEFAULT_SITE_DATA.gallery[idx] ? DEFAULT_SITE_DATA.gallery[idx].url : item.url
        };
      }
      return item;
    });

    // Merge any missing keys from DEFAULT_SITE_DATA safely
    return {
      ...DEFAULT_SITE_DATA,
      ...parsed,
      hero: { ...DEFAULT_SITE_DATA.hero, ...(parsed.hero || {}) },
      about: { ...DEFAULT_SITE_DATA.about, ...(parsed.about || {}) },
      contact: { ...DEFAULT_SITE_DATA.contact, ...(parsed.contact || {}) },
      settings: { ...DEFAULT_SITE_DATA.settings, ...(parsed.settings || {}) },
      menu: Array.isArray(parsed.menu) ? parsed.menu : DEFAULT_SITE_DATA.menu,
      gallery: galleryList
    };
  } catch (err) {
    console.error('Failed to parse CMS data, falling back to defaults:', err);
    return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
  }
}

/**
 * Persists site data into localStorage and broadcasts the change.
 * @param {object} data 
 * @param {boolean} notify Whether to dispatch custom event
 */
function saveSiteData(data, notify = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (notify) {
      window.dispatchEvent(new CustomEvent('masalsi_data_updated', { detail: data }));
    }
  } catch (err) {
    console.error('Failed to save CMS data to localStorage:', err);
    throw err;
  }
}

/**
 * Resets site data to defaults.
 */
function resetSiteData() {
  saveSiteData(DEFAULT_SITE_DATA);
}

/**
 * Downloads site data as a JSON file.
 */
function exportSiteData() {
  const data = getSiteData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `masalsi-cafe-yedek-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Verifies entered admin PIN.
 * @param {string} pin 
 * @returns {boolean}
 */
function verifyAdminPin(pin) {
  const data = getSiteData();
  const validPin = data.settings && data.settings.adminPin ? data.settings.adminPin : '1234';
  return String(pin).trim() === String(validPin).trim();
}

/**
 * Updates admin PIN.
 * @param {string} newPin 
 */
function setAdminPin(newPin) {
  if (!newPin || newPin.length < 4) {
    throw new Error('PIN en az 4 karakter olmalıdır.');
  }
  const data = getSiteData();
  data.settings = data.settings || {};
  data.settings.adminPin = String(newPin).trim();
  saveSiteData(data);
}

/**
 * Session auth helpers.
 */
function setAdminSession(authenticated) {
  if (authenticated) {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

// Attach globally for browser usage
window.MasalsiCMS = {
  getSiteData,
  saveSiteData,
  resetSiteData,
  exportSiteData,
  verifyAdminPin,
  setAdminPin,
  setAdminSession,
  isAdminAuthenticated,
  DEFAULT_SITE_DATA
};
