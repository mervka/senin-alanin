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

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')
  const [selectedMood, setSelectedMood] = useState('')
  const [rating, setRating] = useState(5)
  const [thought, setThought] = useState('')
  const [message, setMessage] = useState('')
  const [entries, setEntries] = useState([])
  
  

  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistTitle, setWishlistTitle] = useState('')
  const [wishlistType, setWishlistType] = useState('İstek')
  const [wishlistTerm, setWishlistTerm] = useState('Kısa vadeli')
  const [wishlistMessage, setWishlistMessage] = useState('')

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
          
        </section>
      </main>
  )
}

export default App