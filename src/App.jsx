import { useEffect, useState } from 'react'
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
      'Önce 48 sekme açar, sonra “yaparız ya” der',
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
    question: 'Merve’nin bu hayattaki gizli nihai amacı nedir?',
    options: [
      'Dünyayı kurtarmak',
      'Estetik, konfor, lezzetli yemekler ve huzur dolu bir krallık kurup keyif yapmak',
      'Çok çalışmak çok üretmek',
      'Ölmek',
    ],
    correctAnswer: 'Dünyayı kurtarmak',
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
    question: 'Merve’nin yazın her öğün yiyebileceği tek şey nedir?',
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
  
  

  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistTitle, setWishlistTitle] = useState('')
  const [wishlistType, setWishlistType] = useState('İstek')
  const [wishlistTerm, setWishlistTerm] = useState('Kısa vadeli')
  const [wishlistMessage, setWishlistMessage] = useState('')
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
    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      rating,
      thought,
      createdAt: new Date().toLocaleString('tr-TR'),
    }

    const { error } = await supabase
        .from('entries')
        .insert({
          mood: selectedMood,
          rating: Number(rating),
          thought: thought,
        })

    if (error) {
      console.error('Supabase kayıt hatası:', error)
      setMessage('Kaydederken bir sorun oldu. Tekrar dener misin?')
      return
    }

    await fetchEntries()
    setMessage('Kaydettim. Bugünün burada güvende.')
    setThought('')
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

            <h1>Bugünü buraya nasıl bırakmak istersin?</h1>

            <p className="description">
              Önce bugünün hissini seç. Sonra içinden geçenleri buraya bırak.
            </p>

            <div className="form-section">
              <h2>Bugünün hissi</h2>

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
                <h2>Günün puanı</h2>
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
              <h2>İçinden geçenler</h2>

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

                        <p>{entry.thought}</p>

                        <small>{entry.createdAt}</small>
                      </article>
                  ))}
                </div>
            )}
          </section>
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

          <p className="eyebrow">Wishlist</p>

          <h1>Yaz Gülüm Hayallerini Yaz</h1>

          <p className="description">
            Kısa vadeli planlarını, uzun vadeli hayallerini ya da bir gün
            birlikte yapmak istediklerinizi buraya yazabilirsin.
          </p>

          <div className="form-section">
            <h2>Ne eklemek istiyorsun?</h2>

            <div className="option-row compact-options">
              {['İstek', 'Plan'].map((type) => (
                  <button
                      key={type}
                      className={
                        wishlistType === type
                            ? 'option-button selected'
                            : 'option-button'
                      }
                      onClick={() => setWishlistType(type)}
                  >
                    {type}
                  </button>
              ))}
            </div>

            <input
                className="text-input"
                value={wishlistTitle}
                onChange={(event) => setWishlistTitle(event.target.value)}
                placeholder={
                  wishlistType === 'İstek'
                      ? 'Hayata veya kendine dair isteklerini yaz...'
                      : 'Birlikte ya da kendin için yapmak istediğin planı yaz...'
                }
            />

            <div className="form-section">
              <h2>Zamanı</h2>

              <div className="option-row compact-options">
                {['Kısa vadeli', 'Uzun vadeli'].map((term) => (
                    <button
                        key={term}
                        className={
                          wishlistTerm === term
                              ? 'option-button selected'
                              : 'option-button'
                        }
                        onClick={() => setWishlistTerm(term)}
                    >
                      {term}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <button
              className="primary-button save-button"
              onClick={handleWishlistSave}
          >
            Wishlist’e ekle
          </button>

          {wishlistMessage && (
              <div className="soft-note">
                {wishlistMessage}
              </div>
          )}

          {wishlistItems.filter((item) => item.type === 'İstek').length > 0 && (
              <div className="wishlist-list">
                <h2>İstekler</h2>

                {wishlistItems
                    .filter((item) => item.type === 'İstek')
                    .map((item) => (
                        <article className="wishlist-card" key={item.id}>
                          <strong>{item.title}</strong>
                          <small>{item.term}</small>

                          <label className="status-label">
                            Durum
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
                        </article>
                    ))}
              </div>
          )}

          {wishlistItems.filter((item) => item.type === 'Plan').length > 0 && (
              <div className="wishlist-list">
                <h2>Planlar</h2>

                {wishlistItems
                    .filter((item) => item.type === 'Plan')
                    .map((item) => (
                        <article className="wishlist-card" key={item.id}>
                          <strong>{item.title}</strong>
                          <small>{item.term}</small>

                          <label className="status-label">
                            Durum
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
                        </article>
                    ))}
              </div>
          )}
          
        </section>
      </main>
  )
}


  return (
      <main className="app">
        <section className="welcome-card">
          <p className="eyebrow">Senin Alanın</p>

          <h1>Bugün ne hissediyorsan, burada güvenle kalabilir.</h1>

          <p className="description">
            Burası sadece sana ait küçük bir alan. Gününü, içinden geçenleri,
            isteklerini ve hayallerini yargısızca buraya bırakabilirsin.
          </p>

          <button
              className="primary-button"
              onClick={() => setCurrentPage('today')}
          >
            Bugünün kapısını aç
          </button>
          <button
              className="secondary-button"
              onClick={() => setCurrentPage('wishlist')}
          >
            Wishlist alanına geç
          </button>

          <button
              className="secondary-button"
              onClick={() => setCurrentPage('history')}
          >
            Geçmişe bak
          </button>

          <button
              className="secondary-button"
              onClick={() => setCurrentPage('quiz')}
          >
            Quiz zamanı
          </button>

          <button
              className="secondary-button"
              onClick={() => setCurrentPage('dailyMessage')}
          >
            Günün mesajı
          </button>
          
        </section>
      </main>
  )
}

export default App