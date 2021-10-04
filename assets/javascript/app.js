const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playList = $('.playlist')
const cd = $('.cd')
const heading = $('.header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const songActive = $('.song.active')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Cưới Thôi',
            singer: 'Masew - Bray',
            path: '../Music-Player/assets/music/song1.mp3',
            image: '../Music-Player/assets/img/song1.jpg',
        },
        {
            name: 'Gu',
            singer: 'Cukak Remix',
            path: '../Music-Player/assets/music/song2.mp3',
            image: '../Music-Player/assets/img/song2.jpg',
        },
        {
            name: 'Sang Xịn Mịn',
            singer: 'Cukak Remix',
            path: '../Music-Player/assets/music/song3.mp3',
            image: '../Music-Player/assets/img/song3.jpg',
        },
        {
            name: 'Nắm Đôi Bàn Tay',
            singer: 'Cukak Remix',
            path: '../Music-Player/assets/music/song4.mp3',
            image: '../Music-Player/assets/img/song4.jpg',
        },
        {
            name: 'Ghé Qua',
            singer: 'Dic Tofu',
            path: '../Music-Player/assets/music/song5.mp3',
            image: '../Music-Player/assets/img/song5.jpg',
        },
        {
            name: '3107 - 3',
            singer: 'WN Duongg Nautitie',
            path: '../Music-Player/assets/music/song6.mp3',
            image: '../Music-Player/assets/img/song6.jpg',
        },
        {
            name: 'Kẻ Theo Đuổi Ánh Sáng',
            singer: 'Huy Vac',
            path: '../Music-Player/assets/music/song7.mp3',
            image: '../Music-Player/assets/img/song7.jpg',
        },
        {
            name: 'Họ Yêu Ai Mất Rồi',
            singer: 'Doan Hieu - Mr.Paa',
            path: '../Music-Player/assets/music/song8.mp3',
            image: '../Music-Player/assets/img/song8.jpg',
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Masew - Phúc Du - Độ Mixi - Pháo',
            path: '../Music-Player/assets/music/song9.mp3',
            image: '../Music-Player/assets/img/song9.jpg',
        },
        {
            name: 'Em là BadGirl Trong Bộ Váy Ngắn',
            singer: 'Niz - Tran Huyen Diep',
            path: '../Music-Player/assets/music/song10.mp3',
            image: '../Music-Player/assets/img/song10.jpg',
        },
        {
            name: 'Dịu Dàng Em Đến',
            singer: 'Erik',
            path: '../Music-Player/assets/music/song11.mp3',
            image: '../Music-Player/assets/img/song11.jpg',
        }
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <div class="title">${song.name}</div>
                        <div class="author">${song.singer}</div>
                    </div>
                    <div class="options">
                        <i class="fas fa-ellipsis-h"></i>
                     </div>
                </div>
            `
        })
        playList.innerHTML = html.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        // xử lý phóng to, thu nhỏ
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop 
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song được pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent 
            }
        }

        // Xử lý tua song 1
        // progress.onchange = function(e) {
        //     const seekTime = audio.duration / 100 * e.target.value
        //     audio.currentTime = seekTime 
        // }

        // Xử lý tua song 2
        progress.oninput = function(e) {
            setTimeout(function() {
                audio.play()
            }, 500)
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime 
        }

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        // Xử lý next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        // Xử lý bật/tắt random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }

        // Xử lý next song khi ended song
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // xử lý lặp lại 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)

        }
        
        // xử lý chọn song khi click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const options = e.target.closest('.options')
            if (songNode || options) {
                // Xử lý click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý options
                if (options) {

                }
            }
            
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        } 
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        } 
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        
        setTimeout(() => {
            if (this.currentIndex >= 4) {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                })
            }
        }, 300)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    // getCurrentSong: function() {   tại sao khi dùng cách này nhập trên tab console.log: app.currentSong nó ra undefine
    //     var currentSong = this.songs[this.currentIndex]
    //     console.log(currentSong)
    //     return currentSong
    // },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()
        // this.getCurrentSong()

        // Lắng nghe, xử lý các sự kiện(DOM event)
        this.handleEvent()

        // Tải bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong()

        // In ra màn hình
        this.render()

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
}

app.start()