// UI texts in every target language (the target language is also the UI language).
// Used both in the browser (app.js) and when building static pages (scripts/build-pages.mjs).

export const LANGS = ['en', 'ru', 'tr', 'es', 'fr'];
export const DEFAULT_LANG = 'en';
// Every language has its own folder; the site root only redirects to one of them.
export const pathFor = (lang) => `${lang}/`;

export const FLAGS = {
  ru: '<svg viewBox="0 0 9 6" aria-hidden="true"><rect width="9" height="6" fill="#fff"/><rect y="2" width="9" height="2" fill="#0039A6"/><rect y="4" width="9" height="2" fill="#D52B1E"/></svg>',
  en: '<svg viewBox="0 0 60 30" aria-hidden="true"><clipPath id="uk-t"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  tr: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#E30A17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.25" cy="10" r="4" fill="#E30A17"/><polygon fill="#fff" points="14.70,10.00 16.43,9.44 16.43,7.62 17.50,9.09 19.22,8.53 18.16,10.00 19.22,11.47 17.50,10.91 16.43,12.38 16.43,10.56"/></svg>',
  es: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></svg>',
  fr: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="2" fill="#EF4135"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#0055A4"/></svg>',
};


export const T = {
  ru: {
    clear: 'Очистить', sourceCode: 'Исходный код',
    offerTitle: 'Пусть переводчик будет под рукой', offerYes: 'Показать, как', offerNo: 'Не сейчас',
    offerText: 'Добавьте GeSMS на главный экран телефона: когда придёт СМС латиницей, перевод будет в одно касание. Бесплатно, без регистрации, займёт пару секунд.',
    installLink: 'Как установить приложение', installTitle: 'Как установить приложение', installNow: 'Установить',
    install: [
      ['Android', 'Откройте сайт в Chrome, нажмите меню ⋮ и выберите «Установить приложение» (или «Добавить на главный экран»), затем «Установить».'],
      ['iPhone и iPad', 'Откройте сайт в Safari, нажмите «Поделиться» (квадрат со стрелкой вверх), выберите «На экран „Домой“» и нажмите «Добавить».'],
      ['Компьютер', 'В Chrome или Edge нажмите значок установки в адресной строке или откройте меню и выберите «Установить GeSMS».'],
    ],
    installNote: 'Иконка с котиком появится рядом с другими приложениями. Приложение открывается без адресной строки, а грузинские буквы получаются даже без интернета.',
    name: 'русский', word: 'кот', capLatin: 'грузинский\nлатиницей', capKa: 'грузинский',
    title: 'Перевод грузинской латиницы и СМС на русский — GeSMS',
    description: 'Переводчик грузинских СМС, написанных латиницей: gamarjoba → გამარჯობა → привет. Транслитерация в грузинские буквы и перевод на русский, английский, турецкий, испанский, французский. Бесплатно.',
    keywords: 'грузинская латиница, перевод с грузинского, грузинские смс, транслит грузинский, грузинский переводчик, грузинский алфавит, перевести грузинский текст латиницей',
    tagline: 'Перевод грузинских СМС. Перевод грузинской латиницы.',
    phLatin: 'Вставьте грузинский текст латиницей, например из СМС: gamarjoba, rogor khar?',
    phTarget: 'Перевод. Можно писать и здесь, чтобы получить текст по-грузински',
    phKa: 'Грузинскими буквами',
    ariaLatin: 'Грузинский текст латиницей', ariaTarget: 'Перевод', ariaKa: 'Грузинский текст грузинскими буквами',
    chooseLang: 'Язык перевода', catAlt: 'Котик с телефоном',
    copy: 'Копировать', translating: 'Перевожу…',
    offline: 'Нет сети: перевод появится, когда она вернётся.',
    error: 'Не удалось перевести: сервисы перевода недоступны. Попробуйте позже.',
    termsLink: 'Условия использования', ok: 'Понятно',
    terms: [
      ['Как есть.', 'Сервис бесплатный и предоставляется «как есть», без каких-либо гарантий: точности, полноты, пригодности для ваших целей, доступности и бесперебойной работы.'],
      ['Возможны ошибки.', 'Транслитерация и перевод выполняются автоматически и могут быть неверными. Не полагайтесь на них в юридических, медицинских, финансовых, официальных и других важных вопросах.'],
      ['Передача текста третьим лицам.', 'Для перевода введённый текст отправляется в Google Translate (Google LLC) и MyMemory (Translated srl). Они обрабатывают его по своим правилам, на которые мы не влияем и за которые не отвечаем.'],
      ['Анонимная статистика.', 'Мы считаем обезличенную статистику использования (например, число переводов и выбранные языки) с помощью Umami на собственном сервере: без cookies, без сохранения IP-адресов и без текстов, которые вы переводите. Если в браузере включён запрет отслеживания (Do Not Track), статистика не собирается.'],
      ['Персональные данные.', 'Не вводите персональные данные (свои и чужие), пароли, коммерческую тайну и иные сведения, раскрытие которых нежелательно. Вводя их, вы делаете это добровольно, соглашаетесь на их передачу третьим лицам и принимаете риск их раскрытия; вводя чужие данные, подтверждаете, что вправе их передавать.'],
      ['Ваша ответственность.', 'Вы отвечаете за вводимый текст и его законность, соблюдение прав третьих лиц, закона и условий сторонних сервисов, а также за использование результата.'],
      ['Ограничение ответственности.', 'В максимальной степени, допустимой законом, автор не отвечает за любые прямые и косвенные убытки, упущенную выгоду, утрату или раскрытие данных, последствия ошибок, недоступность сервиса и действия третьих лиц.'],
      ['Согласие.', 'Пользуясь сервисом, вы принимаете эти условия и все риски. Если не согласны, не пользуйтесь сервисом. Условия могут меняться без уведомления.'],
    ],
    aboutTitle: 'Что это и зачем',
    about: [
      'Грузины часто пишут латиницей: так набирают СМС и сообщения в WhatsApp, Viber и Telegram, когда на телефоне нет грузинской раскладки. Например, «gamarjoba, rogor khar?». Обычный переводчик такой текст не понимает. GeSMS сначала превращает грузинскую латиницу в настоящие грузинские буквы, а затем переводит на русский, английский, турецкий, испанский или французский.',
      'Транслитерация понимает разные способы набора: sh, ch, kh, ts, dz, апострофы (t\', k\', ch\') и раскладку клавиатуры (T, S, W, R, J, Z, C). Неоднозначные буквы (t — это თ или ტ, k — კ, ქ или ყ) подбираются по словарю, а если перевод выглядит бессмысленным, приложение пробует другие варианты.',
      'Работает и в обратную сторону: напишите ответ по-русски и получите его по-грузински и латиницей, чтобы отправить в СМС. Бесплатно, без регистрации, на телефоне и компьютере. Можно установить как приложение.',
    ],
  },

  en: {
    clear: 'Clear', sourceCode: 'Source code',
    offerTitle: 'Keep the translator at hand', offerYes: 'Show me how', offerNo: 'Not now',
    offerText: 'Add GeSMS to your phone’s home screen: next time an SMS in Latin letters arrives, the translation is one tap away. Free, no sign-up, takes a few seconds.',
    installLink: 'How to install the app', installTitle: 'How to install the app', installNow: 'Install',
    install: [
      ['Android', 'Open the site in Chrome, tap the ⋮ menu and choose “Install app” (or “Add to Home screen”), then “Install”.'],
      ['iPhone and iPad', 'Open the site in Safari, tap “Share” (the square with an up arrow), choose “Add to Home Screen” and tap “Add”.'],
      ['Computer', 'In Chrome or Edge, click the install icon in the address bar or open the menu and choose “Install GeSMS”.'],
    ],
    installNote: 'A kitten icon will appear next to your other apps. The app opens without the address bar, and Georgian letters work even offline.',
    name: 'english', word: 'cat', capLatin: 'georgian\nin latin', capKa: 'georgian',
    title: 'Georgian in Latin letters to English translator — GeSMS',
    description: 'Translate Georgian SMS written in Latin letters: gamarjoba → გამარჯობა → hello. Converts to Georgian script and translates to English, Russian, Turkish, Spanish, French. Free.',
    keywords: 'georgian latin translator, georgian translit, georgian sms translation, georgian to english, latin to georgian script, georgian alphabet converter, translate georgian',
    tagline: 'Translate Georgian SMS. Translate Georgian written in Latin letters.',
    phLatin: 'Paste Georgian in Latin letters, e.g. from an SMS: gamarjoba, rogor khar?',
    phTarget: 'Translation. You can type here too to get Georgian',
    phKa: 'In Georgian script',
    ariaLatin: 'Georgian in Latin letters', ariaTarget: 'Translation', ariaKa: 'Georgian in Georgian script',
    chooseLang: 'Translation language', catAlt: 'Kitten with a phone',
    copy: 'Copy', translating: 'Translating…',
    offline: 'Offline: the translation will appear when you are back online.',
    error: 'Translation failed: the services are unavailable. Try again later.',
    termsLink: 'Terms of use', ok: 'Got it',
    terms: [
      ['As is.', 'The service is free and provided “as is”, without warranties of any kind, including accuracy, completeness, fitness for a particular purpose, availability or uninterrupted operation.'],
      ['Errors happen.', 'Transliteration and translation are automatic and may be wrong. Do not rely on them for legal, medical, financial, official or other important matters.'],
      ['Third parties.', 'To translate, your text is sent to Google Translate (Google LLC) and MyMemory (Translated srl). They process it under their own terms, which we do not control and are not responsible for.'],
      ['Anonymous statistics.', 'We count anonymous usage statistics (such as the number of translations and the languages chosen) with Umami on our own server: no cookies, no stored IP addresses and none of the text you translate. If your browser sends Do Not Track, no statistics are collected.'],
      ['Personal data.', 'Do not enter personal data (yours or anyone else’s), passwords, trade secrets or other information you would not want disclosed. If you do, you do so voluntarily, consent to its transfer to third parties and accept the risk of disclosure; by entering other people’s data, you confirm you are entitled to share it.'],
      ['Your responsibility.', 'You are responsible for the text you enter and its legality, for respecting third-party rights, applicable law and third-party terms, and for how you use the results.'],
      ['Limitation of liability.', 'To the maximum extent permitted by law, the author is not liable for any direct or indirect damages, lost profits, loss or disclosure of data, consequences of errors, unavailability of the service or actions of third parties.'],
      ['Acceptance.', 'By using the service you accept these terms and all risks. If you do not agree, do not use the service. These terms may change without notice.'],
    ],
    aboutTitle: 'What it does',
    about: [
      'Georgians often type in Latin letters: SMS, WhatsApp, Viber and Telegram messages written without a Georgian keyboard, like “gamarjoba, rogor khar?”. Regular translators don’t understand this. GeSMS turns Georgian written in Latin letters into real Georgian script and then translates it into English, Russian, Turkish, Spanish or French.',
      'It understands different typing styles: sh, ch, kh, ts, dz, apostrophes (t\', k\', ch\') and the Georgian keyboard layout (T, S, W, R, J, Z, C). Ambiguous letters (t can be თ or ტ, k can be კ, ქ or ყ) are resolved with a dictionary, and if the translation looks like nonsense, other variants are tried.',
      'It works both ways: type your reply in English and get it in Georgian script and in Latin letters, ready to send by SMS. Free, no sign-up, works on phones and computers, and can be installed as an app.',
    ],
  },

  tr: {
    clear: 'Temizle', sourceCode: 'Kaynak kodu',
    offerTitle: 'Çevirmen hep elinizin altında olsun', offerYes: 'Nasıl yapılır', offerNo: 'Şimdi değil',
    offerText: 'GeSMS’i telefonunuzun ana ekranına ekleyin: Latin harfli bir SMS geldiğinde çeviri tek dokunuşla açılır. Ücretsiz, kayıt gerektirmez, birkaç saniye sürer.',
    installLink: 'Uygulama nasıl yüklenir', installTitle: 'Uygulama nasıl yüklenir', installNow: 'Yükle',
    install: [
      ['Android', 'Siteyi Chrome’da açın, ⋮ menüsüne dokunun ve “Uygulamayı yükle” (veya “Ana ekrana ekle”) seçeneğini, ardından “Yükle”yi seçin.'],
      ['iPhone ve iPad', 'Siteyi Safari’de açın, “Paylaş”a (yukarı oklu kare) dokunun, “Ana Ekrana Ekle”yi seçin ve “Ekle”ye dokunun.'],
      ['Bilgisayar', 'Chrome veya Edge’de adres çubuğundaki yükleme simgesine tıklayın ya da menüyü açıp “GeSMS’i yükle”yi seçin.'],
    ],
    installNote: 'Kedili simge diğer uygulamalarınızın yanında görünür. Uygulama adres çubuğu olmadan açılır; Gürcü harfleri internet olmadan da çalışır.',
    name: 'türkçe', word: 'kedi', capLatin: 'latin harfli\ngürcüce', capKa: 'gürcüce',
    title: 'Latin harfli Gürcüce çeviri — GeSMS',
    description: 'Latin harfleriyle yazılmış Gürcüce SMS’leri çevirin: gamarjoba → გამარჯობა → merhaba. Gürcü alfabesine dönüştürür ve Türkçe, Rusça, İngilizce, İspanyolca, Fransızcaya çevirir. Ücretsiz.',
    keywords: 'gürcüce çeviri, latin harfli gürcüce, gürcüce sms çevirisi, gürcüce türkçe çeviri, gürcü alfabesi, gürcüce translit',
    tagline: 'Gürcüce SMS çevirisi. Latin harfli Gürcüce çevirisi.',
    phLatin: 'Latin harfli Gürcüce metni yapıştırın, örneğin bir SMS’ten: gamarjoba, rogor khar?',
    phTarget: 'Çeviri. Gürcüce karşılığını almak için buraya da yazabilirsiniz',
    phKa: 'Gürcü harfleriyle',
    ariaLatin: 'Latin harfli Gürcüce', ariaTarget: 'Çeviri', ariaKa: 'Gürcü harfleriyle Gürcüce',
    chooseLang: 'Çeviri dili', catAlt: 'Telefonlu kedicik',
    copy: 'Kopyala', translating: 'Çevriliyor…',
    offline: 'Bağlantı yok: çeviri, bağlantı geri geldiğinde görünecek.',
    error: 'Çeviri yapılamadı: servisler kullanılamıyor. Daha sonra tekrar deneyin.',
    termsLink: 'Kullanım koşulları', ok: 'Anladım',
    terms: [
      ['Olduğu gibi.', 'Hizmet ücretsizdir ve doğruluk, eksiksizlik, belirli bir amaca uygunluk, erişilebilirlik veya kesintisiz çalışma dahil hiçbir garanti verilmeksizin “olduğu gibi” sunulur.'],
      ['Hatalar olabilir.', 'Harf çevirisi ve çeviri otomatik yapılır ve hatalı olabilir. Hukuki, tıbbi, mali, resmi veya diğer önemli konularda bunlara güvenmeyin.'],
      ['Üçüncü taraflar.', 'Çeviri için metniniz Google Translate’e (Google LLC) ve MyMemory’ye (Translated srl) gönderilir. Bu hizmetler metni kendi koşullarına göre işler; bu koşullar üzerinde kontrolümüz ve sorumluluğumuz yoktur.'],
      ['Anonim istatistikler.', 'Kendi sunucumuzdaki Umami ile anonim kullanım istatistikleri tutuyoruz (örneğin çeviri sayısı ve seçilen diller): çerez kullanılmaz, IP adresleri saklanmaz ve çevirdiğiniz metinler kaydedilmez. Tarayıcınız “Do Not Track” gönderiyorsa istatistik toplanmaz.'],
      ['Kişisel veriler.', 'Kendinize veya başkalarına ait kişisel verileri, şifreleri, ticari sırları ve ifşa olmasını istemediğiniz diğer bilgileri girmeyin. Girerseniz bunu kendi isteğinizle yapar, üçüncü taraflara aktarılmasını kabul eder ve ifşa riskini üstlenirsiniz; başkalarının verilerini girerek bunları paylaşma hakkınız olduğunu onaylarsınız.'],
      ['Sorumluluğunuz.', 'Girdiğiniz metinden ve hukuka uygunluğundan, üçüncü kişilerin haklarına, yürürlükteki mevzuata ve üçüncü taraf koşullarına uyulmasından ve sonuçların kullanımından siz sorumlusunuz.'],
      ['Sorumluluğun sınırlandırılması.', 'Yasanın izin verdiği azami ölçüde yazar; doğrudan veya dolaylı zararlardan, kâr kaybından, verilerin kaybından veya ifşasından, hataların sonuçlarından, hizmetin kullanılamamasından ve üçüncü tarafların eylemlerinden sorumlu değildir.'],
      ['Kabul.', 'Hizmeti kullanarak bu koşulları ve tüm riskleri kabul etmiş olursunuz. Kabul etmiyorsanız hizmeti kullanmayın. Koşullar önceden bildirilmeksizin değiştirilebilir.'],
    ],
    aboutTitle: 'Ne işe yarar',
    about: [
      'Gürcüler sık sık Latin harfleriyle yazar: Gürcü klavyesi olmadan yazılan SMS, WhatsApp, Viber ve Telegram mesajları, örneğin “gamarjoba, rogor khar?”. Sıradan çeviriciler bunu anlamaz. GeSMS, Latin harfleriyle yazılmış Gürcüceyi gerçek Gürcü alfabesine dönüştürür, ardından Türkçe, Rusça, İngilizce, İspanyolca veya Fransızcaya çevirir.',
      'Farklı yazım alışkanlıklarını tanır: sh, ch, kh, ts, dz, kesme işaretleri (t\', k\', ch\') ve Gürcü klavye düzeni (T, S, W, R, J, Z, C). Birden fazla karşılığı olan harfler (t: თ veya ტ, k: კ, ქ veya ყ) sözlük yardımıyla seçilir; çeviri anlamsız görünürse başka seçenekler denenir.',
      'İki yönde çalışır: cevabınızı Türkçe yazın, Gürcü harfleriyle ve SMS ile göndermeye hazır Latin harfleriyle alın. Ücretsizdir, kayıt gerektirmez, telefonda ve bilgisayarda çalışır, uygulama olarak yüklenebilir.',
    ],
  },

  es: {
    clear: 'Borrar', sourceCode: 'Código fuente',
    offerTitle: 'Tenga el traductor a mano', offerYes: 'Mostrar cómo', offerNo: 'Ahora no',
    offerText: 'Añada GeSMS a la pantalla de inicio de su teléfono: la próxima vez que llegue un SMS en letras latinas, la traducción estará a un toque. Gratis, sin registro, lleva unos segundos.',
    installLink: 'Cómo instalar la aplicación', installTitle: 'Cómo instalar la aplicación', installNow: 'Instalar',
    install: [
      ['Android', 'Abra el sitio en Chrome, toque el menú ⋮ y elija «Instalar aplicación» (o «Añadir a pantalla de inicio») y luego «Instalar».'],
      ['iPhone y iPad', 'Abra el sitio en Safari, toque «Compartir» (el cuadrado con una flecha hacia arriba), elija «Añadir a pantalla de inicio» y toque «Añadir».'],
      ['Ordenador', 'En Chrome o Edge, haga clic en el icono de instalación de la barra de direcciones o abra el menú y elija «Instalar GeSMS».'],
    ],
    installNote: 'Aparecerá un icono con un gatito junto a sus otras aplicaciones. La aplicación se abre sin barra de direcciones y las letras georgianas funcionan incluso sin conexión.',
    name: 'español', word: 'gato', capLatin: 'georgiano\nen latino', capKa: 'georgiano',
    title: 'Traductor de georgiano en letras latinas — GeSMS',
    description: 'Traduzca SMS en georgiano escritos con letras latinas: gamarjoba → გამარჯობა → hola. Convierte al alfabeto georgiano y traduce al español, ruso, inglés, turco y francés. Gratis.',
    keywords: 'traductor georgiano, georgiano en letras latinas, traducir sms georgiano, georgiano a español, alfabeto georgiano, transliteración georgiana',
    tagline: 'Traducción de SMS en georgiano. Traducción de georgiano en letras latinas.',
    phLatin: 'Pegue georgiano en letras latinas, por ejemplo de un SMS: gamarjoba, rogor khar?',
    phTarget: 'Traducción. También puede escribir aquí para obtener el georgiano',
    phKa: 'En alfabeto georgiano',
    ariaLatin: 'Georgiano en letras latinas', ariaTarget: 'Traducción', ariaKa: 'Georgiano en alfabeto georgiano',
    chooseLang: 'Idioma de traducción', catAlt: 'Gatito con un teléfono',
    copy: 'Copiar', translating: 'Traduciendo…',
    offline: 'Sin conexión: la traducción aparecerá cuando vuelva la red.',
    error: 'No se pudo traducir: los servicios no están disponibles. Inténtelo más tarde.',
    termsLink: 'Condiciones de uso', ok: 'Entendido',
    terms: [
      ['Tal cual.', 'El servicio es gratuito y se ofrece «tal cual», sin garantías de ningún tipo, incluidas la exactitud, la integridad, la idoneidad para un fin concreto, la disponibilidad o el funcionamiento ininterrumpido.'],
      ['Puede haber errores.', 'La transliteración y la traducción son automáticas y pueden ser incorrectas. No confíe en ellas para asuntos legales, médicos, financieros, oficiales u otros importantes.'],
      ['Terceros.', 'Para traducir, su texto se envía a Google Translate (Google LLC) y a MyMemory (Translated srl), que lo tratan según sus propias condiciones, que no controlamos y de las que no somos responsables.'],
      ['Estadísticas anónimas.', 'Contamos estadísticas de uso anónimas (como el número de traducciones y los idiomas elegidos) con Umami en nuestro propio servidor: sin cookies, sin guardar direcciones IP y sin los textos que traduce. Si su navegador envía «Do Not Track», no se recogen estadísticas.'],
      ['Datos personales.', 'No introduzca datos personales (suyos o de otras personas), contraseñas, secretos comerciales ni otra información cuya divulgación no desee. Si lo hace, lo hace voluntariamente, consiente su envío a terceros y asume el riesgo de divulgación; al introducir datos de otras personas, confirma que tiene derecho a compartirlos.'],
      ['Su responsabilidad.', 'Usted es responsable del texto que introduce y de su legalidad, del respeto de los derechos de terceros, de la ley aplicable y de las condiciones de servicios de terceros, así como del uso que haga de los resultados.'],
      ['Limitación de responsabilidad.', 'En la máxima medida permitida por la ley, el autor no responde de daños directos o indirectos, lucro cesante, pérdida o divulgación de datos, consecuencias de errores, indisponibilidad del servicio ni actos de terceros.'],
      ['Aceptación.', 'Al usar el servicio, acepta estas condiciones y todos los riesgos. Si no está de acuerdo, no lo utilice. Las condiciones pueden cambiar sin previo aviso.'],
    ],
    aboutTitle: 'Qué hace',
    about: [
      'Los georgianos suelen escribir con letras latinas: SMS y mensajes de WhatsApp, Viber o Telegram escritos sin teclado georgiano, como «gamarjoba, rogor khar?». Los traductores habituales no lo entienden. GeSMS convierte el georgiano escrito con letras latinas en alfabeto georgiano real y luego lo traduce al español, ruso, inglés, turco o francés.',
      'Entiende distintas formas de escribir: sh, ch, kh, ts, dz, apóstrofos (t\', k\', ch\') y la distribución del teclado georgiano (T, S, W, R, J, Z, C). Las letras ambiguas (t puede ser თ o ტ; k, კ, ქ o ყ) se resuelven con un diccionario y, si la traducción no tiene sentido, se prueban otras variantes.',
      'Funciona en ambos sentidos: escriba su respuesta en español y obténgala en alfabeto georgiano y en letras latinas, lista para enviar por SMS. Gratis, sin registro, en el móvil y en el ordenador; se puede instalar como aplicación.',
    ],
  },

  fr: {
    clear: 'Effacer', sourceCode: 'Code source',
    offerTitle: 'Gardez le traducteur à portée de main', offerYes: 'Montrer comment', offerNo: 'Plus tard',
    offerText: 'Ajoutez GeSMS à l’écran d’accueil de votre téléphone : la prochaine fois qu’un SMS en lettres latines arrive, la traduction sera à un geste. Gratuit, sans inscription, quelques secondes suffisent.',
    installLink: 'Comment installer l’application', installTitle: 'Comment installer l’application', installNow: 'Installer',
    install: [
      ['Android', 'Ouvrez le site dans Chrome, touchez le menu ⋮ et choisissez « Installer l’application » (ou « Ajouter à l’écran d’accueil »), puis « Installer ».'],
      ['iPhone et iPad', 'Ouvrez le site dans Safari, touchez « Partager » (le carré avec une flèche vers le haut), choisissez « Sur l’écran d’accueil » puis « Ajouter ».'],
      ['Ordinateur', 'Dans Chrome ou Edge, cliquez sur l’icône d’installation dans la barre d’adresse ou ouvrez le menu et choisissez « Installer GeSMS ».'],
    ],
    installNote: 'Une icône avec un chaton apparaîtra à côté de vos autres applications. L’application s’ouvre sans barre d’adresse, et les lettres géorgiennes fonctionnent même hors ligne.',
    name: 'français', word: 'chat', capLatin: 'géorgien\nen latin', capKa: 'géorgien',
    title: 'Traduction du géorgien en lettres latines — GeSMS',
    description: 'Traduisez les SMS géorgiens écrits en lettres latines : gamarjoba → გამარჯობა → bonjour. Conversion en alphabet géorgien et traduction en français, russe, anglais, turc, espagnol. Gratuit.',
    keywords: 'traducteur géorgien, géorgien en lettres latines, traduire sms géorgien, géorgien français, alphabet géorgien, translittération géorgienne',
    tagline: 'Traduction de SMS géorgiens. Traduction du géorgien en lettres latines.',
    phLatin: 'Collez du géorgien en lettres latines, par ex. d’un SMS : gamarjoba, rogor khar?',
    phTarget: 'Traduction. Vous pouvez aussi écrire ici pour obtenir le géorgien',
    phKa: 'En alphabet géorgien',
    ariaLatin: 'Géorgien en lettres latines', ariaTarget: 'Traduction', ariaKa: 'Géorgien en alphabet géorgien',
    chooseLang: 'Langue de traduction', catAlt: 'Chaton avec un téléphone',
    copy: 'Copier', translating: 'Traduction…',
    offline: 'Hors ligne : la traduction apparaîtra au retour du réseau.',
    error: 'Échec de la traduction : services indisponibles. Réessayez plus tard.',
    termsLink: 'Conditions d’utilisation', ok: 'Compris',
    terms: [
      ['En l’état.', 'Le service est gratuit et fourni « en l’état », sans aucune garantie, notamment d’exactitude, d’exhaustivité, d’adéquation à un usage particulier, de disponibilité ou de fonctionnement ininterrompu.'],
      ['Erreurs possibles.', 'La translittération et la traduction sont automatiques et peuvent être erronées. Ne vous y fiez pas pour des questions juridiques, médicales, financières, officielles ou d’autres sujets importants.'],
      ['Tiers.', 'Pour la traduction, votre texte est envoyé à Google Translate (Google LLC) et à MyMemory (Translated srl), qui le traitent selon leurs propres conditions, que nous ne contrôlons pas et dont nous ne sommes pas responsables.'],
      ['Statistiques anonymes.', 'Nous comptons des statistiques d’utilisation anonymes (par exemple le nombre de traductions et les langues choisies) avec Umami sur notre propre serveur : sans cookies, sans conserver d’adresses IP et sans les textes que vous traduisez. Si votre navigateur envoie « Do Not Track », aucune statistique n’est collectée.'],
      ['Données personnelles.', 'N’entrez pas de données personnelles (les vôtres ou celles d’autrui), de mots de passe, de secrets d’affaires ni d’autres informations dont la divulgation n’est pas souhaitée. Si vous le faites, c’est volontairement : vous consentez à leur transfert à des tiers et acceptez le risque de divulgation ; en saisissant les données d’autrui, vous confirmez être autorisé à les partager.'],
      ['Votre responsabilité.', 'Vous êtes responsable du texte saisi et de sa licéité, du respect des droits des tiers, de la loi applicable et des conditions des services tiers, ainsi que de l’usage des résultats.'],
      ['Limitation de responsabilité.', 'Dans toute la mesure permise par la loi, l’auteur n’est pas responsable des dommages directs ou indirects, du manque à gagner, de la perte ou de la divulgation de données, des conséquences d’erreurs, de l’indisponibilité du service ni des actes de tiers.'],
      ['Acceptation.', 'En utilisant le service, vous acceptez ces conditions et l’ensemble des risques. Si vous n’êtes pas d’accord, n’utilisez pas le service. Ces conditions peuvent être modifiées sans préavis.'],
    ],
    aboutTitle: 'À quoi ça sert',
    about: [
      'Les Géorgiens écrivent souvent en lettres latines : SMS et messages WhatsApp, Viber ou Telegram tapés sans clavier géorgien, comme « gamarjoba, rogor khar? ». Les traducteurs classiques ne les comprennent pas. GeSMS convertit le géorgien écrit en lettres latines en véritable alphabet géorgien, puis le traduit en français, russe, anglais, turc ou espagnol.',
      'Il comprend différentes façons de taper : sh, ch, kh, ts, dz, apostrophes (t\', k\', ch\') et la disposition du clavier géorgien (T, S, W, R, J, Z, C). Les lettres ambiguës (t peut être თ ou ტ ; k, კ, ქ ou ყ) sont choisies à l’aide d’un dictionnaire et, si la traduction n’a pas de sens, d’autres variantes sont essayées.',
      'Il fonctionne dans les deux sens : écrivez votre réponse en français et obtenez-la en alphabet géorgien et en lettres latines, prête à être envoyée par SMS. Gratuit, sans inscription, sur téléphone et ordinateur ; installable comme application.',
    ],
  },
};

// Georgian-language block for search engines, the same on every page.
export const KA_ABOUT = {
  title: 'ლათინურიდან ქართულ შრიფტზე გადაყვანა და თარგმანი',
  text: 'ლათინური ასოებით აკრეფილი ქართული ტექსტი (მაგალითად, SMS-ში: „gamarjoba, rogor khar?“) ავტომატურად გადაიყვანება ქართულ შრიფტზე და ითარგმნება რუსულად, ინგლისურად, თურქულად, ესპანურად ან ფრანგულად. მუშაობს პირიქითაც. უფასოა, რეგისტრაციის გარეშე, ტელეფონზეც.',
  keywords: 'ლათინურიდან ქართულად, ქართული შრიფტი, ტრანსლიტერაცია, თარგმანი, ქართული SMS',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const termsHtml = (t) =>
  '<ol>' + t.terms.map(([b, text]) => `<li><b>${esc(b)}</b> ${esc(text)}</li>`).join('') + '</ol>';

export const installHtml = (t) =>
  '<dl>' + t.install.map(([b, text]) => `<dt>${esc(b)}</dt><dd>${esc(text)}</dd>`).join('') + '</dl>'
  + `<p class="note">${esc(t.installNote)}</p>`;

export const aboutHtml = (t) => t.about.map((p) => `<p>${esc(p)}</p>`).join('');
