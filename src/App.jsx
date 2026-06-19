import { useEffect, useState } from 'react'
import {
  Home,
  Sun,
  Star,
  MessageCircle,
  CircleHelp,
  Clock3,
} from 'lucide-react'
import './App.css'
import { supabase } from './supabaseClient'


const moods = [
  { label: 'Mutlu', emoji: '🌞' },
  { label: 'Huzurlu', emoji: '🌿' },
  { label: 'Yorgun', emoji: '🌙' },
  { label: 'Stresli', emoji: '🌧️' },
  { label: 'Kırgın', emoji: '🥀' },
  { label: 'Karışık', emoji: '🫧' },
]

const quizQuestions = [
  {
    id: 1,
    question: 'Merve bir şeye çok heveslendiyse büyük ihtimalle ne olur?',
    options: [
      'Sakin sakin zamanının gelmesini bekler',
      'Önce 48 sekme açar, sonra “ben bunu yaparım ya” der',
      'Hiç bahsetmez',
      'Konuyu unutur',
    ],
    correctAnswer: 'Önce 48 sekme açar, sonra “ben bunu yaparım ya” der',
  },
  {
    id: 2,
    question: 'Merve’nin bir insanda gördüğünde seksi ve çekici bulduğu şey nedir?',
    options: [
      'İyi giyinmiş olması',
      'Çok iyi araba kullanması',
      'Sorun ne olursa olsun hallederiz insanı olması',
      'Ağzının iyi laf yapması',
    ],
    correctAnswer: 'Sorun ne olursa olsun hallederiz insanı olması',
  },
    
  {
    id: 3,
    question: 'Bu uygulama aslında ne için yapıldı?',
    options: [
      'Portfolyoma ekleyeceğim olum',
      'Kimseye dökmediğin içini belki buraya dökersin diye bi umut',
      'Kendimizi geliştiriyoruz işte böyle böyle',
      'Sadece mutlu ol diye',
    ],
    correctAnswer: 'Kimseye dökmediğin içini belki buraya dökersin diye bi umut',
  },
  {
    id: 4,
    question: 'Merve’nin hayatta tahammül edemediği o malum şey nedir?',
    options: [
      'Çok konuşulması',
      'Altı boş özgüven',
      'Sürekli sırıtan bir yüz',
      'Yalakalık',
    ],
    correctAnswer: 'Altı boş özgüven',
  },
  {
    id: 5,
    question: 'Merve’nin bu hayattaki nihai amacı nedir?',
    options: [
      'Feminist devrim',
      'Estetik, konfor, lezzetli yemekler ve huzur dolu bir krallık kurup keyif yapmak',
      'Çok çalışmak çok üretmek',
      'Ölmek',
    ],
    correctAnswer: 'Feminist devrim',
  },
  {
    id: 6,
    question: 'Merve’nin düzen ve temizlik seviyesine 1 ile 10 arasında puanlamanı istesek, sence gerçek puanı kaçtır?',
    options: [
      '5 (Ortalama bir şey işte…)',
      '11! Ben hayatımda böyle temiz ve düzenli biri görmedim',
      '1 (Dünyanın en dağınık, umursamaz insanıdır)',
      '10dur o ya',
    ],
    correctAnswer: '10dur o ya',
  },
  {
    id: 7,
    question: 'Merve’nin burcu ve yükseleni sırasıyla nedir?',
    options: [
      'Boğa-İkizler',
      'İkizler-Başak',
      'Boğa-Başak',
      'Koç-Boğa',
    ],
    correctAnswer: 'Boğa-Başak',
  },
  {
    id: 8,
    question: 'Merve’nin en sevdiği içecek nedir?',
    options: [
      'Bira',
      'Portakal suyu',
      'Su',
      'Americano',
    ],
    correctAnswer: 'Su',
  },
  {
    id: 9,
    question: 'Merve’nin yazın her öğün yiyebileceği şey nedir?',
    options: [
      'Domates-peynir',
      'Karpuz-peynir',
      'Çilek-erik',
      'Soğuk sandviç',
    ],
    correctAnswer: 'Karpuz-peynir',
  },
  {
    id: 10,
    question: 'Merve’yi en çok sinirlendiren şey?',
    options: [
      'Lanlu lunlu konuşulması',
      'Ekilmek',
      'Ona yalan söylenilmesi',
      'Açık olmayan iletişim',
    ],
    correctAnswer: 'Ona yalan söylenilmesi',
  },
  {
    id: 11,
    question: 'Merve’nin yapmaktan en çok keyif aldığı spor nedir?',
    options: [
      'Koşu',
      'Doğa yürüyüşü',
      'Pilates',
      'Yüzmek',
    ],
    correctAnswer: 'Yüzmek',
  },
  {
    id: 12,
    question: 'Merve’yi ikili iletişimde en çok rahatsız eden şey nedir?',
    options: [
      'Karşısındaki insanın çok konuşması',
      'Sürekli sözünün kesilmesi',
      'Tepkisiz dinlenilmesi',
      'Sürekli laf sokulması',
    ],
    correctAnswer: 'Sürekli sözünün kesilmesi',
  },
  {
    id: 13,
    question: 'Merve’yi en çok güldüren şey nedir?',
    options: [
      'Gözü önünde yere düşülmesi',
      'Küçük çocukların anlamsız hareketleri',
      'Çabasız komik olan insanlar',
      'Şive',
    ],
    correctAnswer: 'Çabasız komik olan insanlar',
  },
  {
    id: 14,
    question: 'Merve’yi en çok üzen şey nedir?',
    options: [
      'Planlarının bozulması',
      'Hayvanları kötü durumda görmek',
      'Ona küsülmesi',
      'Sevdiklerinin anlaşamaması',
    ],
    correctAnswer: 'Hayvanları kötü durumda görmek',
  },
  {
    id: 15,
    question: 'Merve’nin en çok ilgisini çeken sosyal bilim nedir?',
    options: [
      'Siyaset bilimi',
      'Coğrafya',
      'Tarih',
      'Sosyoloji',
    ],
    correctAnswer: 'Tarih',
  },
    
]

const dailyMessagePool = [
  'Bugün kendine biraz daha yumuşak davran. Her şeyi aynı anda çözmek zorunda değilsin.',
  'Bunu okuduysan bugün en az bir kere gülümsemen gerekiyor. Kural bu.',
  'Bazen sadece yanında olduğumu bilmen yeter. Bugün de öyle bir gün.',
  'Bugün aklına güzel bir şey gelirse not al. Belki sonra birlikte hayale çeviririz.',
  'Küçük şeyleri fazla büyütme. Ama güzel şeyleri büyütebilirsin.',
  'Bugün biraz yorulduysan sorun değil. Dinlenmek de planın bir parçası.',
  'Seninle ilgili sevdiğim şeylerden biri: bazen fark etmeden günü güzelleştirmen.',
  'Bugün kendini kötü hissedersen buraya dön. Bu alan biraz da bunun için var.',
  'Her gün mükemmel olmak zorunda değil. Ama her gün biraz kendin olman yeter.',
  'Bugünün mesajı: acele etme, bazı güzel şeyler yavaş yavaş oluyor.',
  'Seninle ilgili en güzel şeylerden biri, varlığının bazı şeyleri daha kolay hissettirmesi.',
  'Bugünün küçük notu: kendini ihmal etme.',
  'Bugün bir şeyi kafana çok takarsan, önce nefes al. Sonra yine bakarız.',
  'Bugün ne kadar yoğun olursa olsun, kendine ait minicik bir boşluk bırak.',
  'Sen bazen kendi değerini unutuyorsun gibi geliyor. Ben unutmadım.',
  'Bazı günler sadece geçsin isteriz. O günlerden biriyse, ben yine de yanındayım.',
  'Bugün kendine biraz alan aç. Bu uygulamanın adı boşuna Senin Alanın değil.',
  'Bugünün mesajı biraz basit ama gerçek: seni seviyorum.',
  'Bir şey seni üzüyorsa küçümseme. Hissettiğin şey önemli.',
  'Kendine kızmadan önce, ne kadar uğraştığını da hatırla.',
  'Bugün kendine küçük bir iyilik yap. Büyük olmak zorunda değil.',
]

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')
  const [selectedMood, setSelectedMood] = useState('')
  const [rating, setRating] = useState(5)
  const [thought, setThought] = useState('')
  const [message, setMessage] = useState('')
  const [entries, setEntries] = useState([])
  const [dailyMessage, setDailyMessage] = useState('')
  const [dailyMessageLoading, setDailyMessageLoading] = useState(false)
  const [dailyMessageError, setDailyMessageError] = useState('')
  const [expandedWishlistItemId, setExpandedWishlistItemId] = useState(null)
  const [expandedHistoryId, setExpandedHistoryId] = useState(null)
  const [entryToDelete, setEntryToDelete] = useState(null)
  
  

  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistTitle, setWishlistTitle] = useState('')
  const [wishlistType, setWishlistType] = useState('İstek')
  const [wishlistTerm, setWishlistTerm] = useState('Kısa vadeli')
  const [wishlistMessage, setWishlistMessage] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [checkedQuizIds, setCheckedQuizIds] = useState({})
  const [quizMessage, setQuizMessage] = useState('')
  const [showQuizResult, setShowQuizResult] = useState(false)
  

  async function fetchEntries() {
    const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
      console.error('Günlük kayıtları çekme hatası:', error)
      return
    }

    const formattedEntries = data.map((entry) => ({
      id: entry.id,
      mood: entry.mood,
      rating: entry.rating,
      thought: entry.thought,
      createdAt: new Date(entry.created_at).toLocaleString('tr-TR'),
    }))

    setEntries(formattedEntries)
  }

  async function fetchWishlistItems() {
    const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
      console.error('Wishlist kayıtları çekme hatası:', error)
      return
    }

    const formattedItems = data.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      term: item.term,
      status: item.status,
    }))

    setWishlistItems(formattedItems)
  }

  useEffect(() => {
    fetchEntries()
    fetchWishlistItems()
  }, [])

  useEffect(() => {
    if (currentPage === 'dailyMessage') {
      fetchDailyMessage()
    }
  }, [currentPage])

  async function handleSave() {
    if (!selectedMood) {
      setMessage('Önce bugünün hissini seçelim.')
      return
    }
    if (!thought.trim()) {
      setMessage('Bugünden geriye kalacak en az bir cümle bırakalım.')
      return
    }

    const { data, error } = await supabase
        .from('entries')
        .insert({
          mood: selectedMood,
          rating: rating,
          thought: thought,
        })
        .select()
        .single()

    if (error) {
      console.error('Supabase kayıt hatası:', error)
      setMessage('Kaydederken bir sorun oldu. Tekrar dener misin?')
      return
    }

    setEntries([data, ...entries])
    await fetchEntries()
    setMessage('Kaydettim. Bugünün burada güvende.')
    setThought('')
  }

  function getShortWishlistTitle(title) {
    if (title.length <= 45) {
      return title
    }

    return title.slice(0, 45) + '...'
  }

  async function handleWishlistSave() {
    if (!wishlistTitle.trim()) {
      setWishlistMessage('Önce küçük de olsa bir istek ya da hayal yazalım.')
      return
    }


    const newItem = {
      id: Date.now(),
      title: wishlistTitle,
      type: wishlistType,
      term: wishlistTerm,
      status: 'Aklımda',
    }

    const { error } = await supabase
        .from('wishlist_items')
        .insert({
          title: wishlistTitle,
          type: wishlistType,
          term: wishlistTerm,
          status: 'Aklımda',
        })

    if (error) {
      console.error('Wishlist kayıt hatası:', error)
      setWishlistMessage('Eklerken bir sorun oldu. Tekrar dener misin?')
      return
    }

    await fetchWishlistItems()
    setWishlistTitle('')
    setWishlistType('İstek')
    setWishlistTerm('Kısa vadeli')
    setWishlistMessage('Alanına eklendi güzelim.')
  }

  function handleQuizAnswer(questionId, answer) {
    if (checkedQuizIds[questionId]) {
      return
    }

    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer,
    })

    setQuizMessage('')
  }

  function handleQuizCheck(questionId) {
    if (!quizAnswers[questionId]) {
      setQuizMessage('Önce bir cevap seçmelisin 😌')
      return
    }

    setCheckedQuizIds({
      ...checkedQuizIds,
      [questionId]: true,
    })

    setQuizMessage('')
  }

  function handleQuizNext() {
    setQuizMessage('')

    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
    }
  }

  function handleShowQuizResult() {
    setShowQuizResult(true)
  }

  function handleQuizRestart() {
    setQuizAnswers({})
    setCheckedQuizIds({})
    setCurrentQuizIndex(0)
    setQuizMessage('')
    setShowQuizResult(false)
  }

  function BottomNavigation({ activePage }) {
    return (
        <nav className="bottom-nav">
          <button
              className={activePage === 'welcome' ? 'active' : ''}
              onClick={() => setCurrentPage('welcome')}
          >
            <Home />
            <small>Ana</small>
          </button>

          <button
              className={activePage === 'today' ? 'active' : ''}
              onClick={() => setCurrentPage('today')}
          >
            <Sun />
            <small>Bugün</small>
          </button>

          <button
              className={
                activePage === 'wishlist' ||
                activePage === 'wishes' ||
                activePage === 'plans'
                    ? 'active'
                    : ''
              }
              onClick={() => setCurrentPage('wishlist')}
          >
            <Star />
            <small>Liste</small>
          </button>

          <button
              className={activePage === 'dailyMessage' ? 'active' : ''}
              onClick={() => setCurrentPage('dailyMessage')}
          >
            <MessageCircle />
            <small>Mesaj</small>
          </button>

          <button
              className={activePage === 'quiz' ? 'active' : ''}
              onClick={() => setCurrentPage('quiz')}
          >
            <CircleHelp />
            <small>Quiz</small>
          </button>

          <button
              className={activePage === 'history' ? 'active' : ''}
              onClick={() => setCurrentPage('history')}
          >
            <Clock3 />
            <small>Geçmiş</small>
          </button>
        </nav>
    )
  }

  function getTodayDate() {
    return new Date().toLocaleDateString('en-CA')
  }

  async function fetchDailyMessage() {
    const today = getTodayDate()

    setDailyMessageError('')

    const { data, error } = await supabase
        .from('daily_messages')
        .select('*')
        .eq('message_date', today)
        .maybeSingle()

    if (error) {
      setDailyMessageError('Bugünün mesajı kontrol edilirken bir sorun oldu.')
      return
    }

    if (data) {
      setDailyMessage(data.message_text)
    } else {
      setDailyMessage('')
    }
  }

  async function handleOpenDailyMessage() {
    const today = getTodayDate()

    setDailyMessageLoading(true)
    setDailyMessageError('')

    const { data: existingMessage } = await supabase
        .from('daily_messages')
        .select('*')
        .eq('message_date', today)
        .maybeSingle()

    if (existingMessage) {
      setDailyMessage(existingMessage.message_text)
      setDailyMessageLoading(false)
      return
    }

    const { data: lastMessages } = await supabase
        .from('daily_messages')
        .select('message_text')
        .neq('message_date', today)
        .order('message_date', { ascending: false })
        .limit(1)

    const lastMessage = lastMessages?.[0]?.message_text

    let availableMessages = dailyMessagePool.filter((message) => (
        message !== lastMessage
    ))

    if (availableMessages.length === 0) {
      availableMessages = dailyMessagePool
    }

    const randomIndex = Math.floor(Math.random() * availableMessages.length)
    const selectedMessage = availableMessages[randomIndex]

    const { data, error } = await supabase
        .from('daily_messages')
        .insert({
          message_date: today,
          message_text: selectedMessage,
        })
        .select()
        .single()

    if (error) {
      setDailyMessageError('Mesaj açılırken bir sorun oldu. Bir daha dener misin?')
      setDailyMessageLoading(false)
      return
    }

    setDailyMessage(data.message_text)
    setDailyMessageLoading(false)
  }

  async function updateWishlistStatus(itemId, newStatus) {
    const { error } = await supabase
        .from('wishlist_items')
        .update({ status: newStatus })
        .eq('id', itemId)

    if (error) {
      console.error('Wishlist durum güncelleme hatası:', error)
      setWishlistMessage('Durumu güncellerken bir sorun oldu.')
      return
    }

    setWishlistItems((currentItems) =>
        currentItems.map((item) =>
            item.id === itemId
                ? { ...item, status: newStatus }
                : item
        )
    )
  }

  async function deleteWishlistItem() {
    if (!itemToDelete) {
      return
    }

    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemToDelete.id)

    if (error) {
      setWishlistMessage('Silinirken bir sorun oldu.')
      return
    }

    setWishlistItems(wishlistItems.filter((item) => item.id !== itemToDelete.id))
    setItemToDelete(null)
  }

  async function deleteEntry(entryId) {
    const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId)

    if (error) {
      console.error('History silme hatası:', error)
      return
    }

    setEntries(entries.filter((entry) => entry.id !== entryId))
    setEntryToDelete(null)
  }

  if (currentPage === 'today') {
    
    return (
        <main className="app">
          <section className="page-card">
            <button
                className="back-button"
                onClick={() => setCurrentPage('welcome')}
            >
              ← Geri
            </button>

            <p className="eyebrow">Bugün</p>

            <h1>Bugün buraya ne bırakmak istersin?</h1>

            <p className="description">
              Bugünün hissini seç ve güne bir puan ver. Sonra içinden geçenleri buraya bırak.
            </p>
            
            

            <div className="form-section">
              
              <div className="mood-grid">
                {moods.map((mood) => (
                    <button
                        key={mood.label}
                        className={
                          selectedMood === mood.label
                              ? 'mood-button selected'
                              : 'mood-button'
                        }
                        onClick={() => setSelectedMood(mood.label)}
                    >
                      <span>{mood.emoji}</span>
                      {mood.label}
                    </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <div className="rating-header">
                <strong>{rating}/10</strong>
              </div>

              <input
                  className="rating-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
              />
            </div>

            <div className="form-section">

              <textarea
                  className="text-area"
                  value={thought}
                  onChange={(event) => setThought(event.target.value)}
                  placeholder="Bugün içinde kalan ne var?"
                  rows="5"
              />
            </div>
            

            <button className="primary-button save-button" onClick={handleSave}>
              Bugünü kaydet
            </button>

            {message && (
                <div className="soft-note">
                  {message}
                </div>
            )}
          </section>
          <BottomNavigation activePage="today" />
        </main>
    )
  }

  if (currentPage === 'history') {
    return (
        <main className="app">
          <section className="page-card history-page-card">
            <div className="history-header">
              <button
                  className="back-button"
                  onClick={() => setCurrentPage('welcome')}
              >
                ← Geri
              </button>

              <p className="eyebrow">Geçmiş</p>

              <h1>Bugünlerden geriye kalanlar</h1>

              <p className="description">
                Burada kaydettiğin günlük duygu kayıtlarını görebileceksin.
              </p>
            </div>

            {entries.length === 0 ? (
                <div className="soft-note">
                  Henüz bir günlük kayıt yok. İlk kaydını Bugün alanından bırakabilirsin.
                </div>
            ) : (
                <div className="history-list">
                  {entries.map((entry) => (
                      <article className="history-card" key={entry.id}>
                        <div className="history-card-header">
                          <strong>{entry.mood}</strong>
                          <span>{entry.rating}/10</span>
                        </div>

                        <p
                            className={
                              expandedHistoryId === entry.id
                                  ? 'history-thought expanded'
                                  : 'history-thought'
                            }
                            onClick={() =>
                                setExpandedHistoryId(expandedHistoryId === entry.id ? null : entry.id)
                            }
                        >
                          {expandedHistoryId === entry.id
                              ? entry.thought
                              : entry.thought.length > 55
                                  ? `${entry.thought.slice(0, 55)}...`
                                  : entry.thought}
                        </p>

                        <small>{entry.createdAt}</small>

                        <button
                            className="history-delete-button"
                            onClick={() => setEntryToDelete(entry)}
                        >
                          Sil
                        </button>
                      </article>
                  ))}
                </div>
            )}
          </section>
          {entryToDelete && (
              <div className="confirm-overlay">
                <div className="confirm-box">
                  <h2>Elveda mı diyoruz?</h2>

                  <p>
                    “{entryToDelete.thought.length > 28
                      ? `${entryToDelete.thought.slice(0, 28)}...`
                      : entryToDelete.thought}” kayıtlardan silinsin mi?
                  </p>

                  <div className="confirm-actions">
                    <button
                        className="secondary-button"
                        onClick={() => setEntryToDelete(null)}
                    >
                      Hayır
                    </button>

                    <button
                        className="primary-button"
                        onClick={() => deleteEntry(entryToDelete.id)}
                    >
                      Evet
                    </button>
                  </div>
                </div>
              </div>
          )}
          <BottomNavigation activePage="history" />
        </main>
    )
  }

  if (currentPage === 'dailyMessage') {
    return (
        <main className="app">
          <section className="daily-message-page">
            <button
                className="back-button"
                onClick={() => setCurrentPage('welcome')}
            >
              ← Geri
            </button>

            <p className="eyebrow">GÜNÜN MESAJI</p>

            <h1>Bugün sana küçük bir not var</h1>

            <p className="subtitle">
              Her gün sadece bir mesaj açılacak. Bugünün mesajı seçildikten sonra
              gün boyunca aynı mesaj burada kalacak.
            </p>

            <div className="daily-message-card">
              <p>
                {dailyMessage || 'Bugünün mesajı henüz açılmadı.'}
              </p>
            </div>

            {dailyMessageError && (
                <div className="soft-note">
                  {dailyMessageError}
                </div>
            )}

            <button
                className="primary-button save-button daily-message-button"
                onClick={handleOpenDailyMessage}
                disabled={dailyMessageLoading || Boolean(dailyMessage)}
            >
              {dailyMessageLoading
                  ? 'Mesaj açılıyor...'
                  : dailyMessage
                      ? 'Bugünün mesajı açıldı'
                      : 'Bugünün mesajını aç'}
            </button>
          </section>
          <BottomNavigation activePage="dailyMessage" />
        </main>
    )
  }

  if (currentPage === 'quiz') {
    return (
        <main className="app">
          <section className="page-card">
            <button
                className="back-button"
                onClick={() => setCurrentPage('welcome')}
            >
              ← Geri
            </button>

            <p className="eyebrow">Quiz</p>

            <h1>Beni ne kadar tanıyorsun?</h1>

            <p className="description">
              7 doğrunun altına düşersen bozuşuruz ona göre çöz.
            </p>

            <div className="quiz-list">
              {(() => {
                const currentQuiz = quizQuestions[currentQuizIndex]
                const selectedAnswer = quizAnswers[currentQuiz.id]
                const isChecked = checkedQuizIds[currentQuiz.id]
                const isCorrect = selectedAnswer === currentQuiz.correctAnswer
                const isLastQuestion = currentQuizIndex === quizQuestions.length - 1
                const correctCount = quizQuestions.filter((quiz) => (
                    quizAnswers[quiz.id] === quiz.correctAnswer
                )).length

                const wrongCount = quizQuestions.length - correctCount

                if (showQuizResult) {
                  return (
                      <>
                        <div className="quiz-result-card">
                          <p className="eyebrow">Sonuç</p>

                          <h2>
                            {correctCount} doğru, {wrongCount} yanlış
                          </h2>

                          <p>
                            {correctCount === quizQuestions.length
                                ? 'Tam puan! Bu kadar bilmen biraz şov oldu 😌'
                                : correctCount >= Math.ceil(quizQuestions.length / 2)
                                    ? 'Hmm... bazı konuları tekrar çalışmamız gerekiyor gibi  😌'
                                    : 'YAZIKLAR OLSUN'}
                          </p>
                        </div>

                        <button
                            className="secondary-button"
                            onClick={handleQuizRestart}
                        >
                          Baştan başla
                        </button>
                      </>
                  )
                }

                return (
                    <>
                      <div className="quiz-progress">
                        Soru {currentQuizIndex + 1} / {quizQuestions.length}
                      </div>

                      <div className="quiz-card">
                        <h2>{currentQuiz.question}</h2>

                        <div className="quiz-options">
                          {currentQuiz.options.map((option) => {
                            let optionClassName = 'quiz-option'

                            if (selectedAnswer === option) {
                              optionClassName = 'quiz-option selected'
                            }

                            if (isChecked && option === currentQuiz.correctAnswer) {
                              optionClassName = 'quiz-option correct'
                            }

                            if (
                                isChecked &&
                                selectedAnswer === option &&
                                option !== currentQuiz.correctAnswer
                            ) {
                              optionClassName = 'quiz-option wrong'
                            }

                            return (
                                <button
                                    type="button"
                                    key={option}
                                    className={optionClassName}
                                    onClick={() => handleQuizAnswer(currentQuiz.id, option)}
                                >
                                  {option}
                                </button>
                            )
                          })}
                        </div>

                        {isChecked && isCorrect && (
                            <p className="quiz-feedback">
                              Bravo kız sana 😌
                            </p>
                        )}

                        {isChecked && !isCorrect && (
                            <p className="quiz-feedback">
                              Püü sana: {currentQuiz.correctAnswer}
                            </p>
                        )}
                      </div>

                      {quizMessage && (
                          <div className="soft-note">
                            {quizMessage}
                          </div>
                      )}

                      {!isChecked && (
                          <button
                              className="primary-button save-button"
                              onClick={() => handleQuizCheck(currentQuiz.id)}
                          >
                            Kontrol et
                          </button>
                      )}

                      {isChecked && !isLastQuestion && (
                          <button
                              className="primary-button save-button"
                              onClick={handleQuizNext}
                          >
                            Sonraki soru
                          </button>
                      )}

                      {isChecked && isLastQuestion && (
                          <button
                              className="primary-button save-button"
                              onClick={handleShowQuizResult}
                          >
                            Sonucu gör
                          </button>
                      )}
                    </>
                )
              })()}
            </div>
          </section>
          <BottomNavigation activePage="quiz" />
        </main>
    )
  }
  
if (currentPage === 'wishlist') {
  return (
      <main className="app">
        <section className="page-card">
          <button
              className="back-button"
              onClick={() => setCurrentPage('welcome')}
          >
            ← Geri
          </button>

          <p className="eyebrow">WISHLIST</p>

          <h1>Yaz Gülüm Hayallerini Yaz</h1>

          <p className="description">
            Kısa vadeli planlarını, uzun vadeli hayallerini ya da bir gün birlikte
            yapmak istediklerinizi buraya yazabilirsin.
          </p>

          <div className="form-section">

            <div className="wishlist-type-grid">
              <button
                  type="button"
                  className={wishlistType === 'İstek' ? 'option-button selected' : 'option-button'}
                  onClick={() => setWishlistType('İstek')}
              >
                İstek
              </button>

              <button
                  type="button"
                  className={wishlistType === 'Plan' ? 'option-button selected' : 'option-button'}
                  onClick={() => setWishlistType('Plan')}
              >
                Plan
              </button>
            </div>
          </div>

          <div className="form-section wishlist-time-section">

            <div className="wishlist-term-grid">
              <button
                  type="button"
                  className={wishlistTerm === 'Kısa vadeli' ? 'option-button selected' : 'option-button'}
                  onClick={() => setWishlistTerm('Kısa vadeli')}
              >
                Kısa vadeli
              </button>

              <button
                  type="button"
                  className={wishlistTerm === 'Uzun vadeli' ? 'option-button selected' : 'option-button'}
                  onClick={() => setWishlistTerm('Uzun vadeli')}
              >
                Uzun vadeli
              </button>
            </div>
          </div>

          <div className="wishlist-add-row">
            <input
                className="text-input wishlist-main-input"
                value={wishlistTitle}
                onChange={(event) => setWishlistTitle(event.target.value)}
                placeholder={
                  wishlistType === 'İstek'
                      ? 'Hayata veya kendine dair isteklerin...'
                      : 'Birlikte ya da kendin için yapmak istediğin planlar...'
                }
            />

            <button
                className="wishlist-plus-button"
                onClick={handleWishlistSave}
                type="button"
            >
              +
            </button>
          </div>
          

          {wishlistMessage && (
              <p className="soft-note">
                {wishlistMessage}
              </p>
          )}

          <div className="wishlist-bottom-links">
            <button
                type="button"
                onClick={() => setCurrentPage('wishes')}
            >
              İstekler <span>→</span>
            </button>

            <button
                type="button"
                onClick={() => setCurrentPage('plans')}
            >
              Planlar <span>→</span>
            </button>
          </div>
        </section>

        <BottomNavigation activePage="wishlist" />
      </main>
  )
}

  if (currentPage === 'wishes') {
    const wishes = wishlistItems.filter((item) => item.type === 'İstek')

    return (
        <main className="app list-page-shell">
          <div className="page-content">
            <button
                className="back-button"
                onClick={() => {
                  setItemToDelete(null)
                  setCurrentPage('wishlist')
                }}
            >
              ← Geri
            </button>

            <p className="eyebrow">İSTEKLER</p>

            <h1>İstek listesi</h1>

            <p className="subtitle">
              Burada sadece istek olarak kaydedilenler görünecek.
            </p>

            <div className="wishlist-list">
              {wishes.length === 0 ? (
                  <p className="soft-note">
                    Henüz istek eklenmemiş.
                  </p>
              ) : (
                  wishes.map((item) => (
                      <article className="wishlist-card" key={item.id}>
                        <div className="wishlist-card-header">
                          <div>
                            <button
                                type="button"
                                className="wishlist-title-button"
                                onClick={() =>
                                    setExpandedWishlistItemId(
                                        expandedWishlistItemId === item.id ? null : item.id
                                    )
                                }
                            >
                              {expandedWishlistItemId === item.id
                                  ? item.title
                                  : getShortWishlistTitle(item.title)}
                            </button>

                            {item.note && (
                                <p>{item.note}</p>
                            )}

                            <small>{item.term}</small>
                          </div>
                        </div>

                        <label className="status-label">
                          <span>Durum</span>

                          <select
                              className="status-select"
                              value={item.status}
                              onChange={(event) => updateWishlistStatus(item.id, event.target.value)}
                          >
                            <option value="Aklımda">Aklımda</option>
                            <option value="Başlandı">Başlandı</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                          </select>
                        </label>

                        <button
                            className="delete-button"
                            onClick={() => setItemToDelete(item)}
                        >
                          Sil
                        </button>
                      </article>
                  ))
              )}
            </div>
            {itemToDelete && (
                <div className="confirm-overlay">
                  <div className="confirm-box">
                    <h2>Elveda mı diyoruz?</h2>

                    <p>
                      “{itemToDelete.title}” listeden silinsin mi?
                    </p>

                    <div className="confirm-actions">
                      <button
                          className="secondary-button"
                          onClick={() => setItemToDelete(null)}
                      >
                        Hayır
                      </button>

                      <button
                          className="primary-button"
                          onClick={deleteWishlistItem}
                      >
                        Evet
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </div>
          <BottomNavigation activePage="wishes" />
        </main>
    )
  }

  if (currentPage === 'plans') {
    const plans = wishlistItems.filter((item) => item.type === 'Plan')

    return (
        <main className="app list-page-shell">
          <div className="page-content">
            <button
                className="back-button"
                onClick={() => {
                  setItemToDelete(null)
                  setCurrentPage('wishlist')
                }}
            >
              ← Geri
            </button>

            <p className="eyebrow">PLANLAR</p>

            <h1>Plan listesi</h1>

            <p className="subtitle">
              Burada sadece plan olarak kaydedilenler görünecek.
            </p>

            <div className="wishlist-list">
              {plans.length === 0 ? (
                  <p className="soft-note">
                    Henüz plan eklenmemiş.
                  </p>
              ) : (
                  plans.map((item) => (
                      <article className="wishlist-card" key={item.id}>
                        <div className="wishlist-card-header">
                          <div>
                            <button
                                type="button"
                                className="wishlist-title-button"
                                onClick={() =>
                                    setExpandedWishlistItemId(
                                        expandedWishlistItemId === item.id ? null : item.id
                                    )
                                }
                            >
                              {expandedWishlistItemId === item.id
                                  ? item.title
                                  : getShortWishlistTitle(item.title)}
                            </button>

                            {item.note && (
                                <p>{item.note}</p>
                            )}

                            <small>{item.term}</small>
                          </div>
                        </div>

                        <label className="status-label">
                          <span>Durum</span>

                          <select
                              className="status-select"
                              value={item.status}
                              onChange={(event) => updateWishlistStatus(item.id, event.target.value)}
                          >
                            <option value="Aklımda">Aklımda</option>
                            <option value="Başlandı">Başlandı</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                          </select>
                        </label>

                        <button
                            className="delete-button"
                            onClick={() => setItemToDelete(item)}
                        >
                          Sil
                        </button>
                      </article>
                  ))
              )}
            </div>
            {itemToDelete && (
                <div className="confirm-overlay">
                  <div className="confirm-box">
                    <h2>Elveda mı diyoruz?</h2>

                    <p>
                      “{itemToDelete.title}” listeden silinsin mi?
                    </p>

                    <div className="confirm-actions">
                      <button
                          className="secondary-button"
                          onClick={() => setItemToDelete(null)}
                      >
                        Hayır
                      </button>

                      <button
                          className="primary-button"
                          onClick={deleteWishlistItem}
                      >
                        Evet
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </div>
          <BottomNavigation activePage="plans" />
        </main>
    )
  }

  const todayDateValue = getTodayDate()

  const todayDateTr = new Date().toLocaleDateString('tr-TR')

  function getEntryDateForCompare(entry) {
    if (entry.created_at) {
      return entry.created_at.slice(0, 10)
    }

    if (entry.createdAt) {
      return entry.createdAt.slice(0, 10)
    }

    return ''
  }

  function getEntryTimeValue(entry) {
    if (entry.created_at) {
      return new Date(entry.created_at).getTime()
    }

    if (entry.createdAt) {
      const [datePart, timePart] = entry.createdAt.split(' ')
      const [day, month, year] = datePart.split('.')

      return new Date(`${year}-${month}-${day}T${timePart}`).getTime()
    }

    return 0
  }

  const todayEntries = entries
      .filter((entry) => (
          getEntryDateForCompare(entry) === todayDateValue ||
          getEntryDateForCompare(entry) === todayDateTr
      ))
      .sort((firstEntry, secondEntry) => (
          getEntryTimeValue(secondEntry) - getEntryTimeValue(firstEntry)
      ))

  const todayEntry = todayEntries[0]

  const todayDateLabel = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  }).toLocaleUpperCase('tr-TR')

  const todayDayName = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
  })

  const formattedTodayDayName =
      todayDayName.charAt(0).toLocaleUpperCase('tr-TR') + todayDayName.slice(1)

  return (
      <main className="app minimal-home-shell">
        <section className="minimal-home">
          <p className="minimal-date">{todayDateLabel}</p>

          <h1 className="minimal-day-title">{formattedTodayDayName}</h1>

          <section
              className="minimal-today-card"
              onClick={() => setCurrentPage('today')}
          >
            {!todayEntry ? (
                <>
                  <p>Bugünü henüz kaydetmedin</p>
                  <button>
                    Nasıl hissediyorsun? →
                  </button>
                </>
            ) : (
                <>
                  <p>Bugün kaydedildi</p>

                  <div className="home-entry-summary">
                    <strong>{todayEntry.rating}</strong>

                    <div>
                      <span>{todayEntry.mood}</span>
                      <small>{todayEntry.rating}/10 puan</small>
                    </div>
                  </div>
                </>
            )}
          </section>

          <section className="minimal-menu-grid">
            <button onClick={() => setCurrentPage('wishlist')}>
              <span>Hayaller</span>
              <small>Planlar & İstekler</small>
            </button>

            <button onClick={() => setCurrentPage('dailyMessage')}>
              <span>Mesajım</span>
              <small>Bugüne özel</small>
            </button>

            <button onClick={() => setCurrentPage('quiz')}>
              <span>Quiz</span>
              <small>Beni ne kadar tanıyorsun?</small>
            </button>

            <button onClick={() => setCurrentPage('history')}>
              <span>Geçmiş</span>
              <small>{entries.length} kayıt</small>
            </button>
          </section>

          <p className="minimal-footer-text">
            Seninle her gün
          </p>
        </section>

        <BottomNavigation activePage="welcome" />
      </main>
  )
}

export default App