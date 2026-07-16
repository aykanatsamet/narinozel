let introStarted = false;

// KURSUN GECIRMEZ ANA TETIKLEYICI
function triggerGlobalIntro() {
    if (introStarted) return;
    introStarted = true;

    const hint = document.getElementById('touch-hint');
    const introDate = document.getElementById('intro-date');
    const introScreen = document.getElementById('intro-screen');
    const mainApp = document.getElementById('main-app');

    if (hint) hint.classList.add('hidden');

    setTimeout(() => {
        if (introDate) {
            introDate.classList.remove('hidden');
            introDate.classList.add('date-grow');
        }
        
        setTimeout(() => {
            if (introScreen) introScreen.classList.add('tv-off');
            
            setTimeout(() => {
                if (introScreen) introScreen.style.display = 'none';
                if (mainApp) mainApp.classList.remove('hidden');
                startCountdown(); 
            }, 500);
        }, 2200);
    }, 400);
}


window.addEventListener('click', function(e) {
  
    if (!introStarted) {
        triggerGlobalIntro();
    }
});

window.addEventListener('touchstart', function(e) {
    
    if (e.cancelable) {
        e.preventDefault();
    }
    if (!introStarted) {
        triggerGlobalIntro();
    }
}, { passive: false });

// ==========================================
// HAMBURGER MENÜ VE NAVİGASYON KONTROLLERİ
// ==========================================
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu) {
        sideMenu.classList.toggle('open');
    }
}

function selectTab(tabId) {
    // 1. Tüm tab içeriklerini (section'ları) bul ve gizle
    const allContents = document.querySelectorAll('.tab-content');
    allContents.forEach(content => {
        content.classList.remove('active-content');
        content.style.display = 'none'; // Çakışmaları kesin önler
    });

    // 2. Tıklanan hedef sekmenin ID'sini belirle ve onu görünür yap
    const targetId = tabId.startsWith('tab-') ? tabId : 'tab-' + tabId;
    const targetContent = document.getElementById(targetId);
    
    if (targetContent) {
        targetContent.classList.add('active-content');
        targetContent.style.display = 'block';
        
        // Pürüzsüz animasyon geçişi için milisaniyelik gecikmeyle opacity tetikle
        setTimeout(() => {
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
        }, 50);

        // 📌 [YENİ TETİKLEYİCİ]: Eğer galeri sekmesi açıldıysa, Drive verilerini çek!
        if (tabId === 'gallery') {
            fetchDriveMedia();
        }

    } else {
        console.error("Hedef sekme bulunamadı: " + targetId);
    }

    // 3. Menüdeki aktif link stilini güncelle
    const allLinks = document.querySelectorAll('.menu-link');
    allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(`'${tabId}'`)) {
            link.classList.add('active');
        }
    });

    // 4. Menü geçiş yaptıktan sonra yandan açılan menüyü otomatik kapat
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu && sideMenu.classList.contains('open')) {
        toggleMenu();
    }
    
    // Sayfayı her sekme değişiminde en yukarı pürüzsüzce kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function openNote() {
    const popup = document.getElementById('note-popup');
    const paper = document.querySelector('.paper-luxury-scroll');
    
    // Tıklamayı engelleyen her türlü pointer kilidini butonun üzerinden zorla kaldırıyoruz
    const noteBtn = document.getElementById('open-note-btn') || document.querySelector('.envelope-btn');
    if (noteBtn) {
        noteBtn.style.pointerEvents = 'auto';
    }

    if (popup) {
        // Önceki uçuştan kalan sınıfları sıfırla
        if (paper) {
            paper.classList.remove('paper-fly-away');
            paper.style.opacity = "1";
            paper.style.transform = "";
        }
        popup.classList.remove('hidden');
    }
}

// Mektup Uçurarak Kapatma Fonksiyonu (Dinamik Boşluk Korumalı)
function closeAndFlyNote() {
    const paper = document.querySelector('.paper-luxury-scroll');
    const popup = document.getElementById('note-popup');
    const mektupWrapper = document.getElementById('mektup-wrapper'); // Butonun dış kutusu
    
    if (paper && popup) {
        // Gökyüzüne yumuşakça süzülme animasyonunu tetikliyoruz
        paper.classList.add('paper-fly-away');
        
        // Mektup uçarken butonun sönmesini ve boyutsal olarak küçülmesini başlatıyoruz
        if (mektupWrapper) {
            mektupWrapper.classList.add('fade-out-completely');
        }
        
        // Animasyonlar tamamlandığında popup'ı kapat ve butonu tamamen ortadan kaldır
        setTimeout(() => {
            popup.classList.add('hidden');
            paper.classList.remove('paper-fly-away');
            
            if (mektupWrapper) {
                mektupWrapper.style.display = 'none';
            }

            // [SİHİRLİ DOKUNUŞ]: Buton tamamen yok edildiğinde, 
            // üstteki doğum günü kartına zorla alt boşluk veriyoruz ki VIP Adventure asla yukarı yapışmasın!
            const bCard = document.querySelector('.birthday-card-premium');
            if (bCard) {
                bCard.style.setProperty('margin-bottom', '45px', 'important');
            }
        }, 550); // 1 saniyelik pürüzsüz geçiş süresi
    } else {
        if (popup) popup.classList.add('hidden');
    }
}
function startCountdown() {
    // Kilit açılış tarihi: 26 Temmuz 2027 saat 00:00:00
    const targetDate = new Date('July 26, 2027 00:00:00').getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Kilitlerin Açılma Anı Geldiğinde (Tarih Dolduğunda)
        if (difference <= 0) {
            clearInterval(interval);
            
            const overlay = document.querySelector('.video-overlay');
            const wrapper = document.getElementById('video-wrapper');
            const video = document.getElementById('future-video');
            const videoSource = document.getElementById('future-video-source');
            
            if (overlay) overlay.style.display = 'none';
            if (wrapper) wrapper.classList.remove('video-locked');
            
            if (video && videoSource) {
                const GOOGLE_DRIVE_VIDEO_ID = "BURAYA_VİDEONUN_DRIVE_ID_DEGERINI_YAZ"; 
                videoSource.src = `https://docs.google.com/uc?export=download&confirm=no_antivirus&id=${GOOGLE_DRIVE_VIDEO_ID}`;
                video.load(); 
            }
            return;
        }

        // Klasik Sayaç Hesabı
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');

        if (dEl) dEl.textContent = d < 10 ? '0' + d : d;
        if (hEl) hEl.textContent = h < 10 ? '0' + h : h;
        if (mEl) mEl.textContent = m < 10 ? '0' + m : m;
        if (sEl) sEl.textContent = s < 10 ? '0' + s : s;
    }, 1000);
}

// ==========================================
// HEDİYE AVLI QUİZ OYUNU
// ==========================================
function startQuiz() {
    let answer = prompt("Bizim ilk kahve içtiğimiz gün senin giydiğin kazak ne renkti? (İpucu: Doğru bilene ilk sürpriz kuponu verilecek!)");
    if (answer === null) return;

    if (answer.toLowerCase() === "mavi" || answer.toLowerCase() === "lacivert") { 
        alert("🎉 TEBRİKLER SEVGİLİM! Doğru bildin. Ödülün: 'Yıl Boyunca Geçerli Sınırsız Masaj Kuponu'. Ekran görüntüsü al ve bana göster! Bölüm 1 tamamlandı, oyun alanı başarıyla kapandı.");
        const gCard = document.getElementById('card-game-1');
        const tGames = document.getElementById('tab-games');
        if (gCard) gCard.style.display = 'none'; 
        if (tGames) tGames.innerHTML = "<h2>🎮 Ödül Kazanıldı!</h2><p style='color:#00ff66; margin-top:10px;'>Tüm oyunları temizledin ve hediyelerini aldın sevgilim. Harikasın!</p>";
    } else {
        alert("❌ Yanlış cevap sevgilim, ama hafızanı tazeleyip tekrar deneyebilirsin! Kazanana kadar buradayız ❤️");
    }
}

// ==========================================
// SPOTIFY WRAPPED MODU
// ==========================================
const wrappedSlides = [
    { title: "26.07.2005 🌍", text: "İstanbul, Kadıköy... Dünyanın bu spesifik koordinatında (40.9916° N, 29.0270° E) o gün yüzyılın en güzel mucizesi dünyaya gözlerini açtı." },
    { title: "Gökyüzü Seni Selamladı 🌌", text: "Sen doğduğun an Aslan burcunun parıldayan yıldızları gökyüzünde senin için dizilmişti. Evren o gün çok daha parlaktı." },
    { title: "Evrende Büyük Bir Keşif 🚀", text: "Sen tam doğduğun gün, NASA ünlü Discovery Uzay Mekiği'ni uzaya fırlattı. Çünkü evren bile o gün yapılan en büyük keşfi, yani seni kutlamak istiyordu sevgilim!" }
];

let currentSlideIdx = 0;

function triggerSpotifyWrapped() {
    const wrappedScreen = document.getElementById('wrapped-screen');
    if (!wrappedScreen || !wrappedScreen.classList.contains('hidden')) return;

    wrappedScreen.classList.remove('hidden');
    currentSlideIdx = 0;
    renderWrappedSlide();
}

function renderWrappedSlide() {
    const container = document.getElementById('wrapped-slider');
    if (!container) return;
    const slide = wrappedSlides[currentSlideIdx];
    
    container.innerHTML = `
        <div class="wrapped-card" onclick="nextWrappedSlide()">
            <h2>${slide.title}</h2>
            <p>${slide.text}</p>
            <span style="font-size:10px; color:#eee; margin-top:20px; display:block;">Sıradaki kart için tıkla...</span>
        </div>
    `;
}

function nextWrappedSlide() {
    currentSlideIdx++;
    if (currentSlideIdx < wrappedSlides.length) {
        renderWrappedSlide();
    } else {
        closeWrapped(); 
    }
}

function closeWrapped() {
    const wScreen = document.getElementById('wrapped-screen');
    if (wScreen) wScreen.classList.add('hidden');
}

// ==========================================
// REAL-TIME DRİVE VE KLASÖR SİSTEMİ MANTIĞI
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwRpNuYBXjFwnntoi-t1MKjEL-zvnsV_PVqQ6u5auTpeYhb9wy-Fy2jhjAddCsYBMYIA/exec";

let driveData = { folders: [], rootFiles: [] }; 
let currentActiveFolderId = "1WtSMevhKFUFhcvEgnkV_BgLvUgOyB5l5"; // Ana Klasör ID'si

async function fetchDriveMedia() {
    const grid = document.getElementById("gallery-grid-dynamic");
    if (!grid) return;

    // Yazı kaldırıldı, sadece dönen tatlı kalp emojisi kaldı sevgilim:
    grid.innerHTML = `
        <div class="folder-item-loading">
            <div class="heart-spinner">💓</div>
        </div>
    `;

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        driveData = await response.json();

        renderDriveFolders(); 

    } catch (err) {
        console.error("Hata detayı:", err);
        grid.innerHTML = `<div class="folder-item-loading" style="color: #ff4d79; font-size: 13px;">Bağlantı kurulamadı sevgilim.</div>`;
    }
}

function renderDriveFolders() {
    const grid = document.getElementById("gallery-grid-dynamic");
    const backBtn = document.getElementById("back-to-root-btn");
    const title = document.getElementById("current-folder-title");

    if(!grid) return;
    grid.innerHTML = "";
    if(backBtn) backBtn.classList.add("hidden");
    if(title) title.textContent = "📁 Klasörler";

    currentActiveFolderId = "1WtSMevhKFUFhcvEgnkV_BgLvUgOyB5l5";

    const totalFolders = driveData.folders ? driveData.folders.length : 0;
    const totalRootFiles = driveData.rootFiles ? driveData.rootFiles.length : 0;

    if (totalFolders === 0 && totalRootFiles === 0) {
        grid.innerHTML = `<div class="folder-item-loading">Klasörün henüz boş sevgilim. Anı yükle! ❤️</div>`;
        return;
    }

    if (driveData.folders) {
        driveData.folders.forEach(folder => {
            const item = document.createElement("div");
            item.className = "folder-item-premium";
            item.setAttribute("onclick", `openSpecificFolder('${folder.id}')`);
            
            item.innerHTML = `
                <span class="folder-icon-large">📁</span>
                <span class="folder-name">${folder.name}</span>
                <span class="folder-count">${folder.files.length} Anı</span>
            `;
            grid.appendChild(item);
        });
    }

    if (driveData.rootFiles) {
        driveData.rootFiles.forEach(file => {
            renderFileItem(grid, file, "root");
        });
    }
}

function openSpecificFolder(folderId) {
    const grid = document.getElementById("gallery-grid-dynamic");
    const backBtn = document.getElementById("back-to-root-btn");
    const title = document.getElementById("current-folder-title");

    if(!grid) return;
    grid.innerHTML = "";
    if(backBtn) backBtn.classList.remove("hidden");

    currentActiveFolderId = folderId;

    const targetFolder = driveData.folders.find(f => f.id === folderId);
    if (!targetFolder) return;

    if(title) title.textContent = `📁 ${targetFolder.name}`;

    if (targetFolder.files.length === 0) {
        grid.innerHTML = `<div class="folder-item-loading">Bu klasör henüz boş sevgilim. 🥺</div>`;
        return;
    }

    targetFolder.files.forEach(file => {
        renderFileItem(grid, file, folderId);
    });
}

function renderFileItem(parentGrid, file, folderContextId) {
    const item = document.createElement("div");
    item.className = "media-item-premium";
    item.style.position = "relative";
    
    let previewHTML = "";
    if (file.type === "image") {
        const directImageUrl = `https://lh3.googleusercontent.com/d/${file.id}=w600-h600-p`;
        previewHTML = `
            <img src="${directImageUrl}" 
                 class="media-preview-img" 
                 alt="Anı Fotoğrafı" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300';">
        `;
    } else {
        previewHTML = `
            <div class="video-placeholder-box">
                <span class="media-preview-icon">🎥</span>
                <span class="video-text">Video Anısı</span>
            </div>
        `;
    }

    item.innerHTML = `
        <div class="media-preview-box" style="height: 100%;">
            ${previewHTML}
        </div>
        <button class="delete-media-btn" onclick="deleteDriveMedia(event, '${file.id}', '${folderContextId}')">🗑️</button>
    `;
    parentGrid.appendChild(item);
}
// GÜNCELLENMİŞ SİLME FONKSİYONU
function deleteDriveMedia(event, fileId, folderContextId) {
    event.stopPropagation();
    
    // Şık onay pop-up'ını tetikliyoruz
    showGalleryConfirm(() => {
        // "Evet, Sil" butonuna basılırsa burası çalışır:
        showGalleryLoading("Dosya siliniyor...");

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                action: "delete",
                fileId: fileId
            })
        })
        .then(() => {
            hideGalleryLoading();
            
            // Başarı pop-up'ı
            showGalleryInfo("🧹", "İşlem tamamlandı.", "Dosya silindi.");
            
            if (folderContextId === "root") {
                driveData.rootFiles = driveData.rootFiles.filter(f => f.id !== fileId);
                renderDriveFolders();
            } else {
                const folder = driveData.folders.find(f => f.id === folderContextId);
                if (folder) {
                    folder.files = folder.files.filter(f => f.id !== fileId);
                    openSpecificFolder(folderContextId);
                }
            }
        })
        .catch(err => {
            hideGalleryLoading();
            showGalleryInfo("❌", "Hata", "Silme işlemi sırasında bağlantı hatası oluştu!");
            console.error(err);
        });
    });
}

// GÜNCELLENMİŞ DOSYA YÜKLEME FONKSİYONU
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Şık pembe progress bar'lı yükleniyor popup'ını açıyoruz
    showGalleryLoading("Dosya kaydediliyor...");

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                filename: file.name,
                mimeType: file.type,
                data: base64Data,
                folderId: currentActiveFolderId 
            })
        })
        .then(() => {
            hideGalleryLoading();
            
            // Başarı pop-up'ı yeni mesajla açılıyor
            showGalleryInfo("🎉", "Başarıyla tamamlandı.", "Dosya bu senenin klasörüne kaydedildi.");
            
            setTimeout(() => {
                fetchDriveMedia(); 
            }, 3000);
        })
        .catch(err => {
            hideGalleryLoading();
            showGalleryInfo("❌", "Hata", "Yüklenirken bir sorun oluştu sevgilim!");
            console.error(err);
        });
    };
    reader.readAsDataURL(file);
}

function renderRootFolders() {
    renderDriveFolders();
}

// wrapped tetikleme ve ilk event dinleyicileri ayarı (fetches Drive only when gallery tab selected)
setTimeout(() => {
    const titleEl = document.querySelector('.main-title-luxury');
    if (titleEl) titleEl.addEventListener('click', triggerSpotifyWrapped);
}, 1000);


async function searchSpotifyTracks() {
    const query = document.getElementById("spotify-search-input").value.trim();
    const resultsContainer = document.getElementById("spotify-results");
    if (!query || !resultsContainer) return;


    resultsContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 120px; width: 100%;">
            <div class="heart-loader" style="font-size: 30px;">❤️</div>
        </div>
    `;

    try {
        const requestUrl = `${GOOGLE_SCRIPT_URL}?action=searchSpotify&query=${encodeURIComponent(query)}`;
        const response = await fetch(requestUrl);
        const result = await response.json();
        
        if (result.success && result.data.tracks && result.data.tracks.items.length > 0) {
            resultsContainer.innerHTML = "";
            
            result.data.tracks.items.forEach(track => {
                const trackName = track.name;
                const artistName = track.artists.map(a => a.name).join(", ");
                const albumArt = track.album.images[2] ? track.album.images[2].url : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80';
                const trackUri = track.uri;

                const trackRow = document.createElement("div");
                trackRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); padding: 10px 15px; border-radius: 14px; transition: 0.2s;";
                
                trackRow.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${albumArt}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                        <div style="text-align: left;">
                            <h4 style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px;">${trackName}</h4>
                            <p style="font-size: 11px; color: #6b7280;">${artistName}</p>
                        </div>
                    </div>
                    <button class="btn" style="padding: 6px 14px; font-size: 11px;" onclick="addTrackToOurPlaylist('${trackUri}', '${trackName.replace(/'/g, "\\'")}')">Ekle</button>
                `;
                
                trackRow.onmouseenter = () => trackRow.style.borderColor = "rgba(255, 77, 121, 0.3)";
                trackRow.onmouseleave = () => trackRow.style.borderColor = "rgba(255,255,255,0.04)";
                
                resultsContainer.appendChild(trackRow);
            });
        } else {
            resultsContainer.innerHTML = `<div style="color:#6b7280; font-size:12px; text-align:center; padding: 15px 0;">Hiçbir şarkı bulunamadı sevgilim.</div>`;
        }
        
    } catch (err) {
        console.error("Spotify arama hatası:", err);
        resultsContainer.innerHTML = `<div style="color:#ff4d79; font-size:12px; text-align:center; padding: 15px 0;">Bağlantıda bir kesinti yaşandı sevgilim!</div>`;
    }
}

async function addTrackToOurPlaylist(trackUri, trackName) {
    // Kendine özel Spotify pop-up'ımızı çağırıyoruz:
    showSpotifyConfirm(trackName, () => {
        // "Evet, Ekle" denirse burası çalışır:
        showGalleryLoading("Şarkı çalma listesine ekleniyor...");

        const requestUrl = `${GOOGLE_SCRIPT_URL}?action=addSpotifyTrack&trackUri=${encodeURIComponent(trackUri)}`;
        
        fetch(requestUrl)
            .then(response => response.json())
            .then(result => {
                hideGalleryLoading();
                
                if (result.success) {
                    showGalleryInfo("🎵", "Başarıyla tamamlandı.", `"${trackName}" şarkısı ortak çalma listesine eklendi, listeyi yenileyince göreceksin.`);
                    
                    document.getElementById("spotify-search-input").value = "";
                    const resultsBox = document.getElementById("spotify-results");
                    if (resultsBox) {
                        resultsBox.innerHTML = "";
                        resultsBox.classList.remove("open");
                    }
                    
                    const iframe = document.querySelector(".spotify-player-wrapper iframe");
                    if (iframe) {
                        iframe.src = iframe.src;
                    }
                } else {
                    showGalleryInfo("❌", "Hata", "Şarkı listeye eklenemedi, lütfen daha sonra tekrar dene!");
                }
            })
            .catch(err => {
                hideGalleryLoading();
                showGalleryInfo("❌", "Hata", "Bağlantıda bir kesinti yaşandı sevgilim!");
                console.error("Spotify ekleme hatası:", err);
            });
    });
}

// ==========================================
// CANLI ARAMA ÖNERİ KUTUSU (AUTOCOMPLETE)
// ==========================================
setTimeout(() => {
    const searchInput = document.getElementById("spotify-search-input");
    const resultsBox = document.getElementById("spotify-results");
    if (!searchInput || !resultsBox) return;

    // Öneri kutusu görünümü için sınıf ekle
    resultsBox.classList.add("suggest-box");

    // Kutunun input'a göre konumlanması için ebeveyni relative yap
    if (searchInput.parentElement) {
        searchInput.parentElement.style.position = "relative";
    }

    let searchDebounce;
    searchInput.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        const q = searchInput.value.trim();

        if (q.length < 3) {
            resultsBox.classList.remove("open");
            resultsBox.innerHTML = "";
            return;
        }

        searchDebounce = setTimeout(async () => {
            resultsBox.classList.add("open");
            await searchSpotifyTracks();
        }, 450); // yazmayı bıraktıktan 450ms sonra ara
    });

    // Kutunun dışına tıklanınca kapat
    document.addEventListener("click", (e) => {
        if (!resultsBox.contains(e.target) && e.target !== searchInput) {
            resultsBox.classList.remove("open");
        }
    });

    // Input'a tekrar odaklanınca (sonuç varsa) kutuyu geri aç
    searchInput.addEventListener("focus", () => {
        if (resultsBox.innerHTML.trim() !== "") {
            resultsBox.classList.add("open");
        }
    });
}, 1000);

// =========================================================================
// 🎯 PREMIUM & INTERACTIVE LUXURY QUIZ KONTROL SİSTEMİ (V3 SÜPER GÜNCELLEME)
// =========================================================================

let quizCurrentQuestion = 1;
let quizTimerInterval = null;
let quizSecondsLeft = 4;
let quizPendingAction = null; 

// Özel Tasarım Warn Box Tetikleyici
function showQuizWarn(icon, title, text, btnText, callback) {
    const popup = document.getElementById('quiz-warn-popup');
    const iconEl = document.getElementById('quiz-warn-icon');
    const titleEl = document.getElementById('quiz-warn-title');
    const textEl = document.getElementById('quiz-warn-text');
    const btnEl = document.getElementById('quiz-warn-btn');

    if (!popup) return;

    if (iconEl) iconEl.textContent = icon;
    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.innerHTML = text;
    if (btnEl) btnEl.textContent = btnText;

    popup.classList.remove('hidden');
    quizPendingAction = callback;
}

function dismissQuizWarn() {
    const popup = document.getElementById('quiz-warn-popup');
    if (popup) popup.classList.add('hidden');
    if (quizPendingAction) {
        quizPendingAction();
        quizPendingAction = null;
    }
}

function initiateLuxuryQuiz() {
    const introZone = document.getElementById('quiz-intro-zone');
    const activeZone = document.getElementById('quiz-active-zone');
    
    if (introZone) introZone.classList.add('hidden');
    if (activeZone) activeZone.classList.remove('hidden');
    
    quizCurrentQuestion = 1;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    clearInterval(quizTimerInterval);
    const counterEl = document.getElementById('quiz-question-counter');
    const progressWrapper = document.getElementById('quiz-progress-wrapper');
    const progressBar = document.getElementById('quiz-progress-bar');
    const questionText = document.getElementById('quiz-question-text');
    const playground = document.getElementById('quiz-special-playground');
    const optionsContainer = document.getElementById('quiz-options-container');

    if (counterEl) counterEl.textContent = `SORU ${quizCurrentQuestion} / 6`;
    if (progressWrapper) progressWrapper.classList.add('hidden');
    if (playground) {
        playground.innerHTML = "";
        playground.style.height = "0px"; 
        playground.style.border = "none";
        playground.style.background = "none";
    }
    if (optionsContainer) optionsContainer.innerHTML = "";

    // --------------------------------------------------------
    // SORU 1: İstanbulkart Şifresi (Çizgisel Süre Barı)
    // --------------------------------------------------------
    if (quizCurrentQuestion === 1) {
        questionText.textContent = "Samet'in İstanbulkart şifresi nedir? 🤔";
        
        const options = ["140203", "260705", "190500", "050402"];
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === "260705") {
                    clearInterval(quizTimerInterval);
                    showQuizWarn("🎉", "Tebrikler!", "Doğru cevapladınız sevgilim! 💖", "Harika, İlerle!", () => {
                        quizCurrentQuestion = 2;
                        loadQuizQuestion();
                    });
                } else {
                    handleWrongAnswer(btn);
                }
            };
            optionsContainer.appendChild(btn);
        });

        if (progressWrapper) progressWrapper.classList.remove('hidden');
        if (progressBar) progressBar.style.width = "100%";
        
        let timeLeft = 4.0;
        const totalDuration = 4.0;

        quizTimerInterval = setInterval(() => {
            timeLeft -= 0.05;
            const percentage = (timeLeft / totalDuration) * 100;
            if (progressBar) progressBar.style.width = `${percentage}%`;

            if (timeLeft <= 0) {
                clearInterval(quizTimerInterval);
                showQuizWarn("⏰", "Süre Doldu!", "Zamanı yönetemedin fıstık! Hızlı olmalısın. Tekrar dene!", "Yeniden Dene 🔂", () => {
                    loadQuizQuestion();
                });
            }
        }, 50);
    }

    // --------------------------------------------------------
    // SORU 2: Galatasaray En Sevdiği Futbolcu (Kompakt ve Sabit Ekran)
    // --------------------------------------------------------

    else if (quizCurrentQuestion === 2) {
        questionText.textContent = "Samet'in Galatasaray'da en sevdiği futbolcu kimdir? 🦁";

        const mainOptions = [
            { name: "Victor Nelsson", correct: false },
            { name: "Lucas Torreira", correct: false },
            { name: "Leroy Sane", correct: true },
            { name: "Yaser Asprilla", correct: false }
        ];

        mainOptions.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.textContent = opt.name;
            btn.onclick = () => {
                if (opt.correct) {
                    openSaneSubQuiz(btn, optionsContainer);
                } else {
                    handleWrongAnswer(btn);
                }
            };
            optionsContainer.appendChild(btn);
        });
    }
// --------------------------------------------------------
    // SORU 3: En Sevdiği Yemek (Cacık Çılgınlığı)
    // --------------------------------------------------------
    else if (quizCurrentQuestion === 3) {
        questionText.textContent = "Samet'in yemeyi en sevdiği şey nedir? 🥣";

        const initialOptions = ["Cacık", "Cacık", "Cacık", "Cacık"];
        initialOptions.forEach(() => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.textContent = "Cacık";
            btn.onclick = () => {
                triggerCacikGrid(optionsContainer, btn); // ← tıklanan butonu geçir
            };
            optionsContainer.appendChild(btn);
        });
    }

// --------------------------------------------------------
    // SORU 4: Kalmadığı Yurt (Görünmez Şıklar - Tam Kazı Kazan Modu)
    // --------------------------------------------------------
    else if (quizCurrentQuestion === 4) {
        questionText.textContent = "Samet İstanbul'da hangi yurtta kalmamıştır? 🏢";
        
        const yurtOptions = [
            { name: "Cerrah Mehmet Paşa KYK Yurdu", correct: false },
            { name: "KSS KYK Yurdu", correct: false },
            { name: "FSM KYK Yurdu", correct: false },
            { name: "Cevizlibağ KYK Yurdu", correct: true } 
        ];

        yurtOptions.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.style.color = "transparent";
            btn.style.textShadow = "none";
            btn.textContent = opt.name;
            
            // Şıkkın o an görünür olup olmadığını takip eden özel bir durum tanımlıyoruz
            let isRevealed = false;
            
            btn.onclick = () => {
                // EĞER ŞIK HENÜZ GÖRÜNMEZ İSE (İlk Tıklama - Sadece Yazıyı Göster):
                if (!isRevealed) {
                    btn.style.color = "#fff"; // Yazıyı görünür yap
                    isRevealed = true; // Durumu görünür olarak güncelle
                    return; // İlk tıklamada doğru veya yanlış fark etmeksizin işlemi burada bitir!
                }
                
                // EĞER ŞIK ZATEN GÖRÜNÜR İSE VE TEKRAR TIKLANDIYSA (İkinci Tıklama - Karar Verme):
                if (isRevealed) {
                    if (opt.correct) {
                        // Görünür olan doğru şıkka tekrar basılırsa tebrik popup'ını aç
                        btn.style.borderColor = "#00ff66";
                        btn.style.background = "rgba(0, 255, 102, 0.05)";
                        setTimeout(() => {
                            showQuizWarn("🎉", "Harika Gözler!", "Görünmez yurttan kurtuldun sevgilim! Doğru cevap.", "Sıradaki Soruya Geç ▷", () => {
                                quizCurrentQuestion = 5;
                                loadQuizQuestion();
                            });
                        }, 500);
                    } else {
                        // Görünür olan yanlış şıkka tekrar basılırsa kırmızı titreme animasyonunu tetikle
                        btn.classList.add("quiz-option-wrong");
                        setTimeout(() => {
                            btn.classList.remove("quiz-option-wrong");
                        }, 500);
                    }
                }
            };
            optionsContainer.appendChild(btn);
        });
    }
// --------------------------------------------------------
    // SORU 5: Gizli Audi (rastgele şıkkın altında, kaydırarak keşfedilir)
    // --------------------------------------------------------
    else if (quizCurrentQuestion === 5) {
        questionText.textContent = "Samet'in almak istediği hayalindeki araba nedir? 🏎️";

        const topCars = ["Fiat Egea", "Toyota Corolla", "Hyundai i20", "Dacia Duster"];
        const underCars = ["Renault Clio", "Honda Civic", "Opel Corsa"]; // yanlış alt şıklar

        // Audi her seferinde rastgele bir şıkkın altında saklanır
        const audiIndex = Math.floor(Math.random() * topCars.length);
        let wrongIdx = 0;

        topCars.forEach((carName, i) => {
            const container = document.createElement("div");
            container.className = "double-layer-option";

            const isAudi = (i === audiIndex);

            // ALT KATMAN (saklı şık)
            const bg = document.createElement("div");
            bg.className = "layer-under";
            bg.textContent = isAudi ? "🏎️ AUDI" : underCars[wrongIdx++];

            bg.onclick = () => {
                if (isAudi) {
                    bg.style.borderColor = "#00ff66";
                    bg.style.background = "rgba(0, 255, 102, 0.08)";
                    showQuizWarn("🏎️", "VROOOM!", "Sahte şıkkın altına saklanan asıl hayalimizi buldun fıstık! Doğru cevap.", "Son Soruya Uç! 🏁", () => {
                        quizCurrentQuestion = 6;
                        loadQuizQuestion();
                    });
                } else {
                    handleWrongAnswer(bg); // sadece titrer, hiçbir şey kendiliğinden hareket etmez
                }
            };

            // ÜST KATMAN (normal görünen, kaydırılabilir şık)
            const handle = document.createElement("div");
            handle.className = "layer-upper";
            handle.textContent = carName;

            initDoubleLayerSlide(handle);

            container.appendChild(bg);
            container.appendChild(handle);
            optionsContainer.appendChild(container);
        });
    }

    // --------------------------------------------------------
    // SORU 6: İsim Seçme (Farklı Font & Aurora Aura)
    // --------------------------------------------------------
    else if (quizCurrentQuestion === 6) {
        questionText.textContent = "Lütfen aşağıdaki isimlerden birini seçer misin fıstık? 🥰";
        
        const names = [
            { name: "Ahmet", correct: false, class: "" },
            { name: "Muhammed", correct: false, class: "" },
            { name: "Kendal Efe 👑", correct: true, class: "kendal-efe-aurora" }, 
            { name: "Emre", correct: false, class: "" }
        ];

        names.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = `quiz-option-btn ${opt.class}`;
            btn.textContent = opt.name;
            
            btn.onclick = () => {
                if (opt.correct) {
                    showQuizWarn("🏆", "KUTLAMALAR BAŞLASIN!", 
                        `<div style="text-align: center;">
                            <span style="font-size: 40px; display: block; margin-bottom: 15px;">🎉👑</span>
                            <span style="font-size: 28px; font-weight: 900; color: #ff4d79; display: block; margin-bottom: 10px;">A+</span>
                            <p style="font-size: 14px; color: #fff; font-weight: 700; margin-bottom: 10px;">Quizi Başarıyla Tamamladınız!</p>
                            <p style="font-size: 12px; color: #9ca3af;">Önceden tahmin ettiğin o harika hediyeleri artık benden almaya hak kazandın sevgilim!</p>
                         </div>`, 
                        "Hediyelerimi Ver Sevgilim! 🎁", () => {
                            const container = document.querySelector(".games-container");
                            if (container) {
                                container.innerHTML = `
                                    <div style="text-align: center; padding: 40px 20px;">
                                        <span style="font-size: 60px; display: block; margin-bottom: 20px;">🏆</span>
                                        <h2 style="font-size: 24px; font-weight: 800; color: #ff4d79; margin-bottom: 10px;">A++ Sürpriz Ustası</h2>
                                        <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">Bu oyun alanındaki tüm kilitleri parçaladın fıstık! Şimdi benden o özel paketlerini isteme zamanı...</p>
                                    </div>
                                `;
                            }
                        }
                    );
                } else {
                    handleWrongAnswer(btn);
                }
            };
            optionsContainer.appendChild(btn);
        });
    }
}

// Yanlış Cevaplarda Şık Titretme Yardımcısı
function handleWrongAnswer(element) {
    element.classList.add("quiz-option-wrong");
    setTimeout(() => {
        element.classList.remove("quiz-option-wrong");
    }, 400);
}

// =========================================================================
// ⚽ SANE ALT KATEGORİ KUTUSU (şıkkın altında açılır, ekran kaymaz)
// =========================================================================
function openSaneSubQuiz(saneBtn, optionsContainer) {
    // Diğer şıkları pasifleştir, Sane'yi seçili işaretle
    optionsContainer.querySelectorAll(".quiz-option-btn").forEach(b => {
        if (b !== saneBtn) {
            b.style.opacity = "0.2";
            b.style.pointerEvents = "none";
        }
    });
    saneBtn.style.borderColor = "#00ff66";
    saneBtn.style.background = "rgba(0, 255, 102, 0.05)";
    saneBtn.style.pointerEvents = "none";

    // Alt soru kutusunu Sane şıkkının hemen altına yerleştir
    const box = document.createElement("div");
    box.className = "sane-sub-box";
    saneBtn.insertAdjacentElement("afterend", box);

    const subQuestions = [
        { q: "🇩🇪 Peki Sane aslen nerelidir?", options: ["Fransa", "Senegal", "Almanya", "İngiltere"], a: "Almanya" },
        { q: "🏃 Peki hangi mevkide oynar?", options: ["Stoper", "Sağ Kanat", "Santrafor", "Kaleci"], a: "Sağ Kanat" },
        { q: "⚽ Peki bir önceki takımı?", options: ["Real Madrid", "Manchester City", "Bayern Münih", "Schalke 04"], a: "Bayern Münih" }
    ];

    let idx = 0;
    renderSub();

    function renderSub() {
        const sq = subQuestions[idx];
        box.innerHTML = `
            <div class="sane-sub-step">Alt Soru ${idx + 1} / ${subQuestions.length}</div>
            <div class="sane-sub-title">${sq.q}</div>
            <div class="sane-sub-options"></div>
        `;
        const optsEl = box.querySelector(".sane-sub-options");

        sq.options.forEach(o => {
            const b = document.createElement("button");
            b.className = "sane-sub-btn";
            b.textContent = o;
            b.onclick = () => {
                if (o === sq.a) {
                    b.style.borderColor = "#00ff66";
                    idx++;
                    if (idx < subQuestions.length) {
                        setTimeout(renderSub, 250);
                    } else {
                        setTimeout(() => {
                            showQuizWarn("⚽", "Transfer Tamamlandı!", "Sane zincirini kusursuz tamamladın sevgilim! ❤️", "Sıradaki Soruya Uç! ✈️", () => {
                                quizCurrentQuestion = 3;
                                loadQuizQuestion();
                            });
                        }, 300);
                    }
                } else {
                    handleWrongAnswer(b);
                }
            };
            optsEl.appendChild(b);
        });
    }
}

// =========================================================================
// 🥣 CACIK PATLAMASI (tıklanan şık patlar, cacıklar içinden saçılır)
// =========================================================================
function triggerCacikGrid(optionsContainer, clickedBtn) {
    const areaHeight = optionsContainer.offsetHeight;

    // Patlama merkezini hesapla: tıklanan butonun alan içindeki yüzdesel konumu
    const areaRect = optionsContainer.getBoundingClientRect();
    const btnRect = clickedBtn.getBoundingClientRect();
    const originX = ((btnRect.left + btnRect.width / 2 - areaRect.left) / areaRect.width) * 100;
    const originY = ((btnRect.top + btnRect.height / 2 - areaRect.top) / areaRect.height) * 100;

    // Diğer şıklar anında kaybolmasın, hızlıca sönsün
    optionsContainer.querySelectorAll(".quiz-option-btn").forEach(b => {
        if (b !== clickedBtn) {
            b.style.transition = "opacity 0.2s ease";
            b.style.opacity = "0";
        }
    });

    // Tıklanan buton şişip patlıyor
    clickedBtn.classList.add("cacik-exploding");

    setTimeout(() => {
        // Patlama sonrası: alanı hazırla
        optionsContainer.innerHTML = "";
        optionsContainer.classList.add("cacik-area-mode");
        optionsContainer.style.height = areaHeight + "px";

        const cols = 4;
        const rows = 4;
        const totalButtons = cols * rows;
        let poppedCount = 0;

        const cells = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) cells.push({ r, c });
        }
        cells.sort(() => Math.random() - 0.5);

        const cellW = 100 / cols;
        const cellH = 100 / rows;

        cells.forEach((cell, i) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn cacik-scatter-btn";
            btn.textContent = "🥣 Cacık";

            // Nihai (hedef) konum: kendi hücresi içinde rastgele nokta
            const jitterX = Math.random() * (cellW * 0.45);
            const jitterY = Math.random() * (cellH * 0.5);
            const targetLeft = cell.c * cellW + jitterX;
            const targetTop = cell.r * cellH + jitterY;
            const rot = (Math.random() * 16 - 8).toFixed(1);

            // BAŞLANGIÇ: patlama merkezinde, minicik
            btn.style.left = originX + "%";
            btn.style.top = originY + "%";
            btn.style.transform = `scale(0.1) rotate(${rot}deg)`;
            btn.style.opacity = "0";

            btn.onclick = () => {
                btn.classList.add("cacik-popped");
                btn.disabled = true;

                poppedCount++;
                if (poppedCount === totalButtons) {
                    setTimeout(() => {
                        optionsContainer.classList.remove("cacik-area-mode");
                        optionsContainer.style.height = "";
                        showQuizWarn("🥣", "Cacıklar Temizlendi!", "Tüm cacıkları afiyetle patlattın sevgilim! Hazırız.", "Bir Sonraki Soru! ▷", () => {
                            quizCurrentQuestion = 4;
                            loadQuizQuestion();
                        });
                    }, 350);
                }
            };

            optionsContainer.appendChild(btn);

            // SAÇILMA: merkezi konumdan hedef konuma yaylı uçuş (her biri minik gecikmeyle)
            setTimeout(() => {
                btn.style.transition = "left 0.55s cubic-bezier(0.34, 1.4, 0.64, 1), top 0.55s cubic-bezier(0.34, 1.4, 0.64, 1), transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease";
                btn.style.opacity = "1";
                btn.style.left = targetLeft + "%";
                btn.style.top = targetTop + "%";
                btn.style.transform = `scale(1) rotate(${rot}deg)`;

                // Uçuş bitince transition'ı kaldırıp kıpırdama animasyonunu başlat
                setTimeout(() => {
                    btn.style.transition = "";
                    btn.style.animationDelay = "0s";
                    btn.style.animationDuration = (2.2 + Math.random() * 2).toFixed(2) + "s";
                    btn.classList.add("cacik-wiggling");
                }, 600);
            }, 30 + i * 25); // butonlar sırayla fışkırır, patlama hissi verir
        });
    }, 380); // butonun şişip patlama süresi
}

// =========================================================================
// 🏎️ ÇİFT KATMANLI SLIDE (şık yalnızca kullanıcının kaydırdığı kadar kayar)
// =========================================================================
function initDoubleLayerSlide(handle) {
    let startX = 0;
    let baseX = 0;      // şıkkın en son bırakıldığı konum
    let currentX = 0;
    let isDragging = false;

    function onMove(clientX) {
        if (!isDragging) return;
        currentX = baseX + (clientX - startX);

        // Sınır: kendi genişliğinden fazla kaymasın
        const limit = handle.offsetWidth;
        if (currentX > limit) currentX = limit;
        if (currentX < -limit) currentX = -limit;

        handle.style.transform = `translateX(${currentX}px)`;
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        baseX = currentX; // bırakıldığı yerde kalır, geri yaylanma/fırlama yok
    }

    // Fare olayları
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        handle.style.transition = 'none';
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    // Dokunmatik olaylar
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        handle.style.transition = 'none';
    }, { passive: true });
    handle.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX));
    handle.addEventListener('touchend', onEnd);
}

// ==========================================
// 🧩 SAMET'İN HEDİYESİ: BASIC PUZZLE SİSTEMİ
// ==========================================
let puzzleState = []; 
let selectedPieceIdx = null; 

function startSametPuzzle() {
    const container = document.getElementById('puzzle-container');
    const startBtn = document.getElementById('start-puzzle-btn');
    if (!container || !startBtn) return;

    container.classList.remove('hidden');
    startBtn.style.display = 'none'; 

    puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Karıştır
    do {
        puzzleState.sort(() => Math.random() - 0.5);
    } while (isPuzzleSolved()); 

    renderPuzzlePieces();
}

function renderPuzzlePieces() {
    const container = document.getElementById('puzzle-container');
    if (!container) return;
    container.innerHTML = '';

    puzzleState.forEach((pieceId, currentIndex) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        if (selectedPieceIdx === currentIndex) {
            piece.classList.add('selected');
        }

        const row = Math.floor(pieceId / 3);
        const col = pieceId % 3;
        const posX = col * -90; 
        const posY = row * -90; 

        piece.style.backgroundPosition = `${posX}px ${posY}px`;
        piece.textContent = pieceId + 1;

        piece.onclick = () => handlePieceClick(currentIndex);
        container.appendChild(piece);
    });
}

function handlePieceClick(index) {
    if (selectedPieceIdx === null) {
        selectedPieceIdx = index;
        renderPuzzlePieces();
    } else {
        const temp = puzzleState[selectedPieceIdx];
        puzzleState[selectedPieceIdx] = puzzleState[index];
        puzzleState[index] = temp;

        selectedPieceIdx = null;
        renderPuzzlePieces();

  if (isPuzzleSolved()) {
            setTimeout(() => {
                showQuizWarn(
                    "🎁", 
                    "YAPBOZ TAMAMLANDI!", 
                    "Lina seni gülümsettiyse;<br><br><strong style='color:#ff4d79; font-size:15px;'>Samet'in hediyesi: 5 veyaaa 10 adet gıdından öpmek :)</strong>", 
                    "Tamam", 
                    () => { 
                        const giftCard = document.querySelector('.samet-gift-card');
                        if (giftCard) {
                            giftCard.innerHTML = `
                                <div style="text-align: center; padding: 15px 0;">
                                    <h4 style="color:#00ff66; font-size: 14px; font-weight:700;">Teşekkür ederim.</h4>
                                    <p style="font-size: 11px; color:#a1a1aa; margin-top:5px;">Seni çok seviyorum!</p>
                                </div>
                            `;
                        }
                    }
                );
            }, 300);
        }
    }
}

function isPuzzleSolved() {
    for (let i = 0; i < puzzleState.length; i++) {
        if (puzzleState[i] !== i) return false;
    }
    return true;
}

// ==========================================
// 🎨 MODERN POP-UP VE PROGRESS BAR KONTROLLERİ
// ==========================================
let confirmCallback = null;

function showGalleryInfo(icon, title, text) {
    const popup = document.getElementById("gallery-info-popup");
    if (!popup) return;
    document.getElementById("gallery-info-icon").textContent = icon;
    document.getElementById("gallery-info-title").textContent = title;
    document.getElementById("gallery-info-text").innerHTML = text;
    popup.classList.remove("hidden");
}

function closeGalleryInfoPopup() {
    const popup = document.getElementById("gallery-info-popup");
    if (popup) popup.classList.add("hidden");
}

function showGalleryConfirm(callback) {
    const popup = document.getElementById("gallery-confirm-popup");
    if (!popup) return;
    confirmCallback = callback;
    popup.classList.remove("hidden");
}

function closeGalleryConfirmPopup(result) {
    const popup = document.getElementById("gallery-confirm-popup");
    if (popup) popup.classList.add("hidden");
    if (result && confirmCallback) {
        confirmCallback();
    }
    confirmCallback = null;
}

function showGalleryLoading(text) {
    const popup = document.getElementById("gallery-loading-popup");
    const textEl = document.getElementById("gallery-loading-text");
    if (popup && textEl) {
        textEl.textContent = text;
        popup.classList.remove("hidden");
    }
}

function hideGalleryLoading() {
    const popup = document.getElementById("gallery-loading-popup");
    if (popup) popup.classList.add("hidden");
}

// ==========================================
// 🎵 SPOTIFY POP-UP KONTROLLERİ
// ==========================================
let spotifyConfirmCallback = null;

function showSpotifyConfirm(trackName, callback) {
    const popup = document.getElementById("spotify-confirm-popup");
    const textEl = document.getElementById("spotify-confirm-text");
    if (!popup || !textEl) return;
    
    textEl.innerHTML = `"${trackName}" şarkısını ortak çalma listemize eklemek istiyor musun? `;
    spotifyConfirmCallback = callback;
    popup.classList.remove("hidden");
}

function closeSpotifyConfirm(result) {
    const popup = document.getElementById("spotify-confirm-popup");
    if (popup) popup.classList.add("hidden");
    if (result && spotifyConfirmCallback) {
        spotifyConfirmCallback();
    }
    spotifyConfirmCallback = null;
}


const DURAK_KOORDINATLARI = {
       
    1: { lat: 41.02227415435072, lon: 29.176402954621224 }, 
    2: { lat: 41.02564991143109, lon: 28.974085681608297 }, 
    3: { lat: 41.02692772829609, lon: 28.974277791128017 }, 
    4: { lat: 41.195650, lon: 29.069217 }  
};

const YAKINLIK_SINIRI_METRE = 75; 

// İki konum arası mesafe hesaplama (Hızlı Haversine Formülü)
function hesaplaMesafe(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// ==========================================
// 📍 TAMAMEN KONUMA BAĞIMLI LOKASYON MOTORU
// ==========================================
function rotaIsiklariniGuncelle() {
    // 🛠️ [GİZLİ TEST MODU]: URL'de ?durak=X parametresi var mı kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    const testDurak = urlParams.get('durak'); // Örn: ?durak=2

    if (testDurak) {
        console.log(`🛠️ Test Modu Aktif: ${testDurak}. durak taklit ediliyor.`);
        
        // Önce tüm durakları sönük yap
        document.querySelectorAll(".timeline-item").forEach(el => {
            el.classList.remove("active-step");
        });
        const tamamlandiKutusu = document.getElementById("rota-tamamlandi-kutusu");
        if (tamamlandiKutusu) tamamlandiKutusu.classList.add("hidden");

        // Seçtiğin durağın ışığını anında yak!
        const hedefDurakEl = document.querySelector(`.timeline-item[data-durak="${testDurak}"]`);
        if (hedefDurakEl) {
            hedefDurakEl.classList.add("active-step");
            
            // Eğer son durak test ediliyorsa (yani 4) tamamlandı kutusunu da göster
            const toplamDurakSayisi = Object.keys(DURAK_KOORDINATLARI).length;
            if (parseInt(testDurak) === toplamDurakSayisi) {
                if (tamamlandiKutusu) tamamlandiKutusu.classList.remove("hidden");
            }
        }
        return; // Test modu aktifse gerçek GPS sorgusuna HİÇ BULAŞMA!
    }

    // ----------------------------------------------------
    // GERÇEK GPS MOTORU (Eğer URL'de test parametresi yoksa burası çalışır):
    if (!navigator.geolocation) return;

    // Önce her şeyi sönük yapıyoruz
    document.querySelectorAll(".timeline-item").forEach(el => {
        el.classList.remove("active-step");
    });
    const tamamlandiKutusu = document.getElementById("rota-tamamlandi-kutusu");
    if (tamamlandiKutusu) tamamlandiKutusu.classList.add("hidden");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const toplamDurakSayisi = Object.keys(DURAK_KOORDINATLARI).length;

            for (const durakNo in DURAK_KOORDINATLARI) {
                const hedef = DURAK_KOORDINATLARI[durakNo];
                const mesafe = hesaplaMesafe(userLat, userLon, hedef.lat, hedef.lon);

                if (mesafe <= YAKINLIK_SINIRI_METRE) {
                    const hedefDurakEl = document.querySelector(`.timeline-item[data-durak="${durakNo}"]`);
                    if (hedefDurakEl) {
                        hedefDurakEl.classList.add("active-step");
                        if (parseInt(durakNo) === toplamDurakSayisi) {
                            if (tamamlandiKutusu) tamamlandiKutusu.classList.remove("hidden");
                        }
                    }
                    break;
                }
            }
        },
        (err) => console.warn("Hızlı konum alınamadı.", err),
        { enableHighAccuracy: true, timeout: 3000, maximumAge: 10000 }
    );
}
// Sayfa her açıldığında konumu anında tara ve rota ışıklarını yak!
window.addEventListener('DOMContentLoaded', rotaIsiklariniGuncelle);