/* ==========================================================================
   DESA WONOANTI PORTAL LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. STICKY NAVBAR & NAVIGATION HIGHLIGHTING
       ========================================================================== */
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header transition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight Active Link on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially to set starting state

    /* ==========================================================================
       2. MOBILE MENU INTERACTION
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = menuToggleBtn.querySelector('.icon-open');
    const iconClose = menuToggleBtn.querySelector('.icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        
        if (isOpen) {
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop scrolling behind menu
        } else {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================================================
       3. COUNT-UP ANIMATION FOR STATISTICS
       ========================================================================== */
    const statsSection = document.querySelector('.statistics-floating-panel');
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedStats = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const countTo = target;
            let start = 0;
            const duration = 2000; // 2 seconds
            const increment = countTo / (duration / 16); // ~60fps
            
            const updateCount = () => {
                start += increment;
                if (start < countTo) {
                    counter.innerText = Math.floor(start);
                    setTimeout(updateCount, 16);
                } else {
                    counter.innerText = countTo;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer for trigger
    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    animateCounters();
                    hasAnimatedStats = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       4. SCROLL REVEAL TRIGGERS
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.reveal-fade-in, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       5. GALLERY FILTER SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Gallery pagination / "Show More" functionality
    const showMoreBtn = document.getElementById('gallery-show-more-btn');
    let galleryLimit = 6;
    let isGalleryExpanded = false;
    let currentFilter = 'all';

    const updateGalleryVisibility = () => {
        // Collect items matching current filter
        const filteredItems = Array.from(galleryItems).filter(item => {
            return currentFilter === 'all' || item.getAttribute('data-category') === currentFilter;
        });

        // Hide all items first
        galleryItems.forEach(item => item.classList.add('hidden'));

        // Determine how many to show
        const itemsToShow = isGalleryExpanded ? filteredItems : filteredItems.slice(0, galleryLimit);

        // Show those items
        itemsToShow.forEach(item => {
            item.classList.remove('hidden');
            item.style.animation = 'fadeIn 0.4s ease';
        });

        // Update button visibility
        if (filteredItems.length > galleryLimit) {
            showMoreBtn.style.display = 'inline-flex';
            if (isGalleryExpanded) {
                showMoreBtn.innerHTML = 'Lihat Lebih Sedikit <i data-lucide="chevron-up" style="width: 18px; height: 18px; margin-left: 8px;"></i>';
            } else {
                showMoreBtn.innerHTML = 'Lihat Lebih Banyak <i data-lucide="chevron-down" style="width: 18px; height: 18px; margin-left: 8px;"></i>';
            }
            // Re-render icons if Lucide is loaded
            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else {
            showMoreBtn.style.display = 'none';
        }
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from other buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            // Add to current button
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            isGalleryExpanded = false; // Reset expansion when changing filter
            updateGalleryVisibility();
        });
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            isGalleryExpanded = !isGalleryExpanded;
            updateGalleryVisibility();
        });
    }

    // Initialize gallery visibility on load
    updateGalleryVisibility();

    /* ==========================================================================
       6. LIGHTBOX MODAL SYSTEM
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Track visible items for navigation
    let visibleGalleryItems = [];
    let currentImageIndex = 0;

    // Open Lightbox
    window.openLightbox = (clickedItem) => {
        // Collect currently filtered/visible items (exclude rich text proker articles from normal image slideshow)
        visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden') && item.getAttribute('data-category') !== 'proker');
        currentImageIndex = visibleGalleryItems.indexOf(clickedItem);
        
        updateLightboxContent();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    // Close Lightbox
    window.closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Restore prev/next buttons
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (prevBtn) prevBtn.style.display = '';
        if (nextBtn) nextBtn.style.display = '';
    };

    // Open Lightbox for Maps (no navigation controls)
    window.openLightboxMap = (src, caption) => {
        lightboxImg.src = src;
        lightboxCaption.innerHTML = caption;
        
        // Hide prev/next buttons
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    // Next/Prev Image Navigation
    window.changeImage = (direction) => {
        currentImageIndex += direction;
        
        // Loop back logic
        if (currentImageIndex >= visibleGalleryItems.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = visibleGalleryItems.length - 1;
        }
        
        updateLightboxContent();
    };

    // Update Lightbox image and details
    const updateLightboxContent = () => {
        const activeItem = visibleGalleryItems[currentImageIndex];
        const img = activeItem.querySelector('.gallery-img');
        const captionText = activeItem.querySelector('.gallery-overlay h4').innerText;
        const tagText = activeItem.querySelector('.gallery-tag').innerText;

        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `<strong>${tagText}</strong> — ${captionText}`;
    };

    // Close Lightbox on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation inside lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        }
    });

    /* ==========================================================================
       7. POTENTIAL MODAL SYSTEM
       ========================================================================== */
    const potentialModal = document.getElementById('potential-modal');
    const potentialModalImg = document.getElementById('potential-modal-img');
    const potentialModalTag = document.getElementById('potential-modal-tag');
    const potentialModalTitle = document.getElementById('potential-modal-title');
    const potentialModalDesc = document.getElementById('potential-modal-desc');
    const potentialModalSource = document.getElementById('potential-modal-source');

    const potentialData = {
        pertanian: {
            tag: 'Pertanian',
            title: 'Ketahanan Pangan & Pertanian',
            image: 'assets/images/pertanian.png',
            desc: `
                <p>Sebagai salah satu lumbung pangan di wilayah Kecamatan Tulakan, sektor pertanian di Desa Wonoanti merupakan pilar utama ketahanan pangan dan ekonomi warga lokal.</p>
                <p>Didukung oleh ketersediaan lahan persawahan subur dan sistem irigasi perdesaan yang baik, komoditas utama yang dihasilkan adalah padi sawah premium dengan cita rasa khas. Selain padi, para petani juga membudidayakan jagung hibrida, kedelai, kacang tanah, serta berbagai jenis sayuran organik bebas pestisida.</p>
                <p>Pemerintah Desa Wonoanti secara konsisten mendukung para petani melalui pembinaan kelompok tani, penyaluran bantuan pupuk bersubsidi, dan perbaikan infrastruktur jalan usaha tani guna mempermudah pengangkutan hasil panen.</p>
                
                <h4 style="font-size: 1.1rem; font-weight: 600; color: #1b4332; margin-top: 1.8rem; margin-bottom: 0.8rem; border-bottom: 2px solid #e9ecef; padding-bottom: 0.5rem;">Peta Potensi Pertanian Pangan Tiap Dusun</h4>
                <p>Sektor pertanian pangan sebagai penyokong utama kebutuhan dasar warga Desa Wonoanti tersebar di beberapa wilayah dusun dengan karakteristik komoditas masing-masing:</p>
                <ul style="padding-left: 1.25rem; margin-bottom: 1rem; line-height: 1.6; list-style-type: disc;">
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Duren:</strong> Menjadi salah satu lumbung pangan utama desa, sektor pertanian di sini didominasi oleh tanaman padi sawah, ketela pohon (singkong) sebagai sumber karbohidrat alternatif, serta berbagai tanaman palawija pendukung.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Krajan:</strong> Didukung lahan basah yang subur, dusun ini aktif memproduksi padi sawah berkualitas tinggi, ketela pohon, serta pengembangan budidaya jamur konsumsi sebagai diversifikasi pangan lokal.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Ngunut:</strong> Selain perkebunan, warga dusun ini aktif mengusahakan pertanian tanaman pangan basah seperti padi sawah musiman dan budidaya ubi jalar yang subur.</li>
                </ul>
            `,
            source: ''
        },
        umkm: {
            tag: 'UMKM',
            title: 'UMKM Unggulan & Kopi Jangkar Emas',
            image: 'assets/images/umkm_kopi_cover.png',
            desc: `
                <p>Kopi Jangkar Emas merupakan salah satu UMKM pengolahan kopi lokal yang berdiri sejak September 2025 di sekitar Desa Wonoanti. Usaha ini hadir dengan tujuan memberikan nilai tambah pada hasil panen kopi masyarakat Pacitan melalui proses pengolahan menjadi kopi berkualitas yang siap dipasarkan. Bahan baku kopi diperoleh dari petani kopi di berbagai wilayah Kabupaten Pacitan dengan menerapkan standar pemilihan buah kopi yang baik. Saat ini produk utama yang dipasarkan berupa kopi bubuk, sementara ke depan usaha ini berencana memperluas penjualan kopi dalam bentuk biji (whole bean) untuk memenuhi kebutuhan pasar dan kedai kopi.</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 1.5rem 0;">
                    <div style="flex: 1; min-width: 250px; max-width: 320px; text-align: center;">
                        <img src="assets/images/umkm_kopi_beans.png" alt="Biji Kopi Pilihan Kopi Jangkar Emas" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Biji kopi pilihan Pacitan yang disortir secara manual.</p>
                    </div>
                    <div style="flex: 1; min-width: 250px; max-width: 320px; text-align: center;">
                        <img src="assets/images/umkm_kopi_roaster.png" alt="Mesin Roasting Kopi Jangkar Emas" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Proses penyangraian (roasting) modern dengan mesin standar industri.</p>
                    </div>
                </div>

                <p>Pemasaran dilakukan melalui penitipan produk di berbagai toko seperti toko oleh-oleh and penggunaan media sosial sebagai katalis pemasaran nantinya, dengan disusul rencana pengembangan penjualan melalui website dan siaran langsung (live selling). Kopi Jangkar Emas juga telah memiliki mitra di beberapa wilayah di Pacitan dan sudah pernah juga menjalin kerja sama dengan mitra dari luar daerah. Selain berorientasi pada kualitas produk, Kopi Jangkar Emas memiliki komitmen untuk memberdayakan masyarakat sekitar melalui rencana penyerapan tenaga kerja lokal dan pengembangan potensi kopi Desa Wonoanti. Dengan memanfaatkan kekayaan sumber daya kopi Pacitan, UMKM ini diharapkan dapat menjadi salah satu ikon produk unggulan yang mampu memperkenalkan cita rasa kopi lokal Pacitan kepada pasar yang lebih luas.</p>
                
                <h4 style="font-size: 1.1rem; font-weight: 600; color: #1b4332; margin-top: 1.8rem; margin-bottom: 0.8rem; border-bottom: 2px solid #e9ecef; padding-bottom: 0.5rem;">Potensi Usaha Mikro & Industri Rumahan (UMKM) Tiap Dusun</h4>
                <p>Desa Wonoanti memiliki keragaman potensi usaha mikro rumahan (UMKM) yang berkembang aktif di enam wilayah dusun sebagai pilar ekonomi lokal:</p>
                <ul style="padding-left: 1.25rem; margin-bottom: 1rem; line-height: 1.6; list-style-type: disc;">
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Duren:</strong> Berkembang usaha rumahan pembuatan tempe, rengginang gurih, permen tape (musiman), kecap manis tradisional, jamu tradisional berkhasiat, serta pembuatan kerajinan sangkar ayam berdasarkan pesanan khusus (custom order).</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Krajan:</strong> Warganya aktif memproduksi gula jawa asli, budidaya jamur konsumsi segar, keripik pisang renyah, kue gapit khas daerah yang manis-gurih, serta pengolahan biji kopi lokal siap konsumsi.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Sriten:</strong> Usaha rumahan yang tumbuh aktif meliputi pembuatan rengginang kering siap goreng, aneka keripik renyah, tempe higienis, serta berbagai produk kerajinan tangan sederhana yang dipasarkan secara lokal melalui pedagang dan pengepul desa.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Ngunut:</strong> Usaha rumahan yang aktif dijalankan masyarakat meliputi produksi tempe, jamu herbal tradisional, dan produksi gula merah kelapa murni.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Bulih:</strong> Terkenal dengan produksi gula jawa berkualitas tinggi, serta makanan olahan rumahan seperti kue kolong-kolong tradisional yang renyah dan warung kelontong pemenuhan kebutuhan warga.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Pojok:</strong> Sekitar 70% masyarakatnya memproduksi gula jawa asli dari nira kelapa sebagai komoditas utama. Selain itu, warga juga mengembangkan usaha rumahan berupa pembuatan tempe, rengginang, pengolahan kopi lokal khas Pojok, aneka keripik, serta kerajinan sapu lidi.</li>
                </ul>
            `,
            source: '',
        },
        wisata: {
            tag: 'Wisata',
            title: 'Wisata Sungai Alami',
            image: 'assets/images/wisata.jpg',
            desc: `
                <p>Sungai di Desa Wonoanti merupakan salah satu unsur alam yang menjadi bagian dari kondisi geografis desa. Aliran sungai ini melewati kawasan yang didominasi oleh bebatuan alami dan pepohonan, sehingga menciptakan pemandangan alam yang masih terjaga. Keberadaan sungai menjadi salah satu potensi sumber daya alam yang dimiliki Desa Wonoanti.</p>
                <p>Selain berfungsi sebagai bagian dari sistem aliran air, sungai juga berperan dalam mendukung keseimbangan lingkungan di sekitarnya. Kondisi kawasan sungai yang dikelilingi vegetasi dan bebatuan mencerminkan karakter wilayah Desa Wonoanti yang berada di daerah perbukitan. Keberadaan sungai turut menjadi bagian dari lingkungan alam desa yang memiliki nilai ekologis dan dapat dimanfaatkan secara bijaksana oleh masyarakat.</p>
                <p>Pelestarian kawasan sungai menjadi salah satu upaya untuk menjaga kualitas lingkungan dan keberlanjutan sumber daya alam. Dengan menjaga kebersihan dan kelestarian sungai, diharapkan fungsi serta manfaatnya dapat terus dirasakan oleh masyarakat dan tetap terpelihara untuk generasi yang akan datang.</p>
            `,
            source: ''
        },
        kakao: {
            tag: 'Perkebunan',
            title: 'Perkebunan Kakao Unggulan',
            image: 'assets/images/kakao.jpg',
            desc: `
                <p>Desa Wonoanti, Kecamatan Tulakan, memiliki potensi perkebunan kakao unggulan dengan total lahan mencapai sekitar 25 hektar yang tersebar di empat dusun utama, yaitu Dusun Krajan, Duren, Ngunut, dan Bulih.</p>
                <p>Sebagian besar tanaman kakao ditanam secara mandiri oleh warga di pekarangan rumah mereka dengan total luas pekarangan mencapai sekitar 15 hektar. Tanaman kakao di Desa Wonoanti sangat istimewa karena bersifat non-musiman dan dapat terus berbuah sepanjang tahun tanpa kenal musim.</p>
                <p>Setiap bulannya, hasil panen biji kakao kering dari para petani mampu mencapai 2 ton. Penjualan biji kakao kering ini dipasarkan kepada pengepul lokal dengan nilai ekonomis yang tinggi, di mana harga biji kakao kering berkualitas dapat mencapai Rp100.000 hingga Rp120.000 per kilogram, menjadikannya salah satu pilar penyokong kesejahteraan ekonomi warga desa Wonoanti.</p>
                
                <h4 style="font-size: 1.1rem; font-weight: 600; color: #1b4332; margin-top: 1.8rem; margin-bottom: 0.8rem; border-bottom: 2px solid #e9ecef; padding-bottom: 0.5rem;">Potensi Komoditas Perkebunan Tiap Dusun</h4>
                <p>Selain perkebunan kakao unggulan, wilayah perbukitan Desa Wonoanti juga menghasilkan keragaman komoditas perkebunan utama yang tersebar di beberapa dusun:</p>
                <ul style="padding-left: 1.25rem; margin-bottom: 1rem; line-height: 1.6; list-style-type: disc;">
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Krajan:</strong> Menghasilkan komoditas utama berupa biji kopi lokal serta kelapa murni yang melimpah sebagai bahan baku pembuatan gula kelapa.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Ngunut:</strong> Komoditas perkebunan utama meliputi perkebunan kakao produktif serta tanaman kayu keras bernilai ekonomi tinggi.</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Dusun Pojok:</strong> Didukung oleh keberadaan ribuan pohon kelapa produktif, dengan sekitar 70% masyarakat yang bekerja sebagai penderes air nira kelapa secara harian untuk pembuatan gula jawa.</li>
                </ul>
            `,
            source: `
                <span style="font-size: 0.85rem; color: #6b7280;">Sumber: <a href="https://lensapacitan.com/potensi-kakao-desa-wonoanti-mampu-produksi-dua-ton-dalam-sebulan/" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: underline; font-weight: 600;">Lensa Pacitan</a></span>
            `
        },
        zoonosis: {
            tag: 'Peta Tematik',
            title: 'Peta Risiko Kerawanan Zoonosis',
            image: 'assets/images/peta_zoonosis.png',
            desc: `
                <p>Penyakit zoonosis merupakan penyakit infeksi yang dapat ditularkan secara alami dari hewan kepada manusia maupun sebaliknya. Berbagai penyakit seperti leptospirosis, rabies, antraks, brucellosis, hingga flu burung merupakan contoh penyakit zoonosis yang masih menjadi perhatian di Indonesia. Tingginya interaksi antara manusia dan hewan ternak, terutama pada wilayah pedesaan yang mayoritas masyarakatnya berprofesi sebagai petani dan peternak, menjadikan pengawasan terhadap potensi zoonosis sebagai salah satu langkah penting dalam menjaga kesehatan masyarakat.</p>
                <p>Sebagai bentuk upaya preventif, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Wonoanti melaksanakan kegiatan Pemetaan Risiko Zoonosis di Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan. Kegiatan ini bertujuan untuk mengidentifikasi persebaran wilayah yang berpotensi menjadi lokasi penyebaran penyakit zoonosis melalui pendekatan spasial (spatial mapping), sehingga dapat memberikan gambaran mengenai tingkat risiko di setiap wilayah desa. Informasi yang dihasilkan diharapkan dapat menjadi dasar bagi pemerintah desa, tenaga kesehatan, petugas peternakan, maupun masyarakat dalam menyusun strategi pencegahan, pengawasan, serta pengendalian penyakit zoonosis secara lebih efektif.</p>
                <p>Tahapan kegiatan diawali dengan proses survei lapangan untuk mengidentifikasi lokasi peternakan yang mewakili kondisi peternakan di Desa Wonoanti. Mengingat keterbatasan waktu dan sumber daya, pengambilan data dilakukan menggunakan metode sampling, yaitu memilih beberapa peternak yang dianggap mampu mewakili kondisi wilayah penelitian. Sebanyak 2–3 peternak dipilih sebagai responden berdasarkan keberadaan ternak, persebaran lokasi peternakan, serta kemudahan akses selama pelaksanaan survei. Dari setiap peternakan tersebut dilakukan pengamatan terhadap 20–30 ekor hewan ternak sebagai sampel pemeriksaan.</p>
                <p>Data yang dikumpulkan meliputi jenis ternak yang dipelihara, jumlah populasi ternak, kondisi kandang, sistem pemeliharaan, kebersihan lingkungan peternakan, ketersediaan sumber air, pengelolaan limbah ternak, serta kondisi kesehatan hewan berdasarkan pengamatan visual. Selain itu, dilakukan pencatatan koordinat geografis setiap lokasi peternakan menggunakan perangkat Global Positioning System (GPS) untuk memperoleh posisi yang akurat dalam proses pemetaan. Seluruh data tersebut kemudian diolah menggunakan Sistem Informasi Geografis (SIG/GIS) sehingga menghasilkan peta sebaran risiko zoonosis berdasarkan radius penyebaran dari setiap titik sumber potensi penyakit.</p>
                <p>Pada penyusunan peta, analisis dilakukan menggunakan pendekatan buffer analysis atau analisis radius penyebaran. Pendekatan ini bertujuan untuk menggambarkan kemungkinan penyebaran risiko penyakit berdasarkan kedekatan suatu wilayah terhadap sumber potensi zoonosis. Semakin dekat suatu lokasi dengan sumber risiko, maka semakin besar pula peluang terjadinya kontak antara manusia dengan agen penyebab penyakit maupun media penularannya. Oleh karena itu, wilayah Desa Wonoanti diklasifikasikan menjadi tiga kategori risiko:</p>
                <ul>
                    <li><strong>Zona Risiko Tinggi (Merah)</strong>: Merupakan wilayah yang berada pada radius 0–200 meter dari lokasi peternakan atau sumber potensi zoonosis. Area ini memiliki tingkat kerawanan tertinggi karena intensitas interaksi antara manusia, ternak, limbah peternakan, serta lingkungan sekitar relatif lebih besar. Di zona ini paparan agen penyakit melalui kontak langsung, kotoran ternak, maupun kontaminasi lingkungan menjadi sangat tinggi. Disarankan biosekuriti ketat, penggunaan APD saat menangani ternak, menjaga kebersihan kandang, dan pemeriksaan berkala.</li>
                    <li><strong>Zona Risiko Sedang (Kuning)</strong>: Berada pada radius 200–500 meter dari sumber potensi zoonosis. Meskipun tingkat risikonya lebih rendah, wilayah ini masih memiliki kemungkinan terdampak akibat mobilitas manusia, perpindahan ternak, aliran air permukaan, maupun faktor lingkungan lainnya. Diperlukan peningkatan sanitasi lingkungan, pengelolaan limbah peternakan, pengawasan lalu lintas ternak, serta pelaporan dini hewan sakit.</li>
                    <li><strong>Zona Risiko Rendah (Hijau)</strong>: Merupakan wilayah yang berada pada radius lebih dari 500 meter dari sumber potensi zoonosis. Jarak yang lebih jauh menyebabkan peluang penularan secara langsung relatif kecil. Namun tetap membutuhkan edukasi zoonosis, pemantauan berkala, serta penerapan Perilaku Hidup Bersih dan Sehat (PHBS) karena penyebaran penyakit juga dipengaruhi cuaca dan perpindahan satwa liar.</li>
                </ul>
                <p>Peta zoonosis yang dihasilkan tidak dimaksudkan untuk menunjukkan keberadaan penyakit secara pasti, melainkan menggambarkan potensi tingkat risiko penyebaran berdasarkan karakteristik spasial lokasi peternakan. Dengan adanya informasi tersebut, pemerintah desa dapat menentukan wilayah prioritas dalam pelaksanaan penyuluhan kesehatan, pengawasan peternakan, program vaksinasi hewan, maupun kegiatan mitigasi lainnya sesuai konsep One Health, yaitu pendekatan yang menekankan keterkaitan erat antara kesehatan manusia, hewan, dan lingkungan.</p>
                <p>Melalui kegiatan pemetaan ini, diharapkan Desa Wonoanti memiliki basis data spasial yang dapat dimanfaatkan dalam perencanaan pembangunan sektor kesehatan dan peternakan secara berkelanjutan. Ke depan, pembaruan data secara berkala serta penambahan jumlah lokasi sampling akan semakin meningkatkan akurasi peta sehingga mampu menjadi instrumen yang efektif dalam mendukung sistem kewaspadaan dini terhadap penyakit zoonosis di tingkat desa.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Sub Unit Wonoanti</span>'
        },
        lalat: {
            tag: 'Peta Tematik',
            title: 'Peta Penyebaran Lalat di Desa Wonoanti',
            image: 'assets/images/peta_lalat.png',
            desc: `
                <p>Lalat merupakan salah satu vektor mekanis yang berperan dalam penyebaran berbagai agen penyakit pada manusia maupun hewan. Keberadaan lalat sangat dipengaruhi oleh kondisi lingkungan, terutama pada area peternakan unggas yang menghasilkan limbah organik berupa kotoran ayam, sisa pakan, dan alas kandang yang lembap. Apabila tidak dikelola dengan baik, kondisi tersebut dapat menjadi media yang ideal bagi perkembangbiakan lalat sehingga meningkatkan risiko penyebaran mikroorganisme patogen ke lingkungan sekitar.</p>
                <p>Di Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan, aktivitas peternakan unggas terkonsentrasi di Dusun Duren dan Dusun Pojok, yang menjadi lokasi peternakan ayam pedaging (broiler) dan ayam petelur (layer). Mengingat kedua jenis usaha peternakan tersebut memiliki populasi ayam yang relatif tinggi serta menghasilkan limbah organik dalam jumlah besar, kedua dusun tersebut menjadi fokus utama dalam kegiatan pemetaan penyebaran lalat yang dilaksanakan oleh Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026.</p>
                <p>Pengumpulan data dilakukan menggunakan metode sampling dengan memilih 2 peternak yang mewakili kondisi peternakan ayam di kedua dusun tersebut. Pada setiap peternakan dilakukan observasi terhadap 3000–6000 ekor ayam sebagai sampel, disertai pengamatan terhadap kondisi kandang, sistem pemeliharaan, kebersihan lingkungan, pengelolaan kotoran ayam, keberadaan genangan air, serta tingkat kepadatan lalat di sekitar lokasi peternakan. Selain itu, koordinat setiap lokasi peternakan dicatat menggunakan perangkat GPS untuk mendukung proses analisis spasial menggunakan Sistem Informasi Geografis (SIG).</p>
                <p>Hasil survei kemudian dianalisis menggunakan metode buffer analysis, yaitu teknik analisis spasial yang menggambarkan potensi persebaran lalat berdasarkan jarak dari sumber perkembangbiakannya. Analisis ini digunakan untuk mengidentifikasi wilayah yang memiliki tingkat risiko berbeda sehingga dapat menjadi dasar dalam penyusunan strategi pengendalian vektor penyakit.</p>
                <p>Berdasarkan analisis tersebut, wilayah sekitar peternakan ayam di Dusun Duren dan Dusun Pojok dibagi menjadi tiga kategori risiko:</p>
                <ul>
                    <li><strong>Zona Risiko Tinggi (Merah)</strong>: Berada pada radius 0–200 meter dari lokasi peternakan. Area ini memiliki potensi kepadatan lalat paling tinggi karena berada sangat dekat dengan sumber limbah organik berupa kotoran ayam dan sisa pakan. Pada zona ini peluang lalat berpindah ke permukiman warga, tempat penyimpanan makanan, maupun fasilitas umum relatif lebih besar sehingga memerlukan perhatian khusus dalam pengelolaan sanitasi lingkungan.</li>
                    <li><strong>Zona Risiko Sedang (Kuning)</strong>: Berada pada radius 200–500 meter dari lokasi peternakan. Meskipun kepadatan lalat mulai berkurang, wilayah ini masih memiliki kemungkinan terdampak akibat kemampuan terbang lalat, arah angin, maupun aktivitas manusia dan kendaraan yang dapat membantu penyebaran vektor. Oleh karena itu, pengelolaan limbah peternakan, kebersihan lingkungan, dan penutupan tempat sampah organik tetap perlu dilakukan secara konsisten.</li>
                    <li><strong>Zona Risiko Rendah (Hijau)</strong>: Berada pada radius lebih dari 500 meter dari lokasi peternakan ayam. Risiko keberadaan lalat pada wilayah ini relatif lebih kecil, namun tidak dapat diabaikan sepenuhnya karena persebaran lalat juga dipengaruhi oleh faktor lingkungan, kondisi cuaca, dan keberadaan sumber makanan lainnya.</li>
                </ul>
                <p>Peta penyebaran lalat ini memberikan gambaran mengenai wilayah yang berpotensi terdampak oleh aktivitas peternakan ayam di Dusun Duren dan Dusun Pojok. Informasi tersebut dapat dimanfaatkan oleh Pemerintah Desa Wonoanti, peternak, maupun masyarakat sebagai dasar dalam merencanakan program pengendalian lalat, mulai dari pengelolaan limbah kandang, peningkatan biosekuriti peternakan, pemasangan perangkap lalat, hingga edukasi mengenai pentingnya sanitasi lingkungan.</p>
                <p>Melalui pemetaan ini diharapkan upaya pengendalian populasi lalat dapat dilakukan secara lebih terarah dan berbasis data spasial. Dengan demikian, risiko penyebaran penyakit yang berkaitan dengan keberadaan lalat sebagai vektor mekanis dapat ditekan, sehingga tercipta lingkungan peternakan yang lebih sehat, produktif, dan aman bagi masyarakat Desa Wonoanti, khususnya di Dusun Duren dan Dusun Pojok.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Sub Unit Wonoanti</span>'
        },
        proker_dagusibu: {
            tag: 'Kegiatan Proker',
            title: 'Edukasi DAGUSIBU, Swamedikasi, serta Pencegahan Leptospirosis & Zoonosis',
            image: 'assets/images/proker_dagusibu.jpg',
            desc: `
                <p>Penggunaan obat yang tepat menjadi salah satu kunci dalam menjaga kesehatan masyarakat. Namun, masih banyak masyarakat yang belum memahami cara mendapatkan, menggunakan, menyimpan, dan membuang obat dengan benar. Di sisi lain, swamedikasi yang dilakukan tanpa pengetahuan yang memadai juga berisiko menyebabkan penggunaan obat yang tidak rasional. Selain itu, masyarakat perlu meningkatkan kewaspadaan terhadap penyakit zoonosis, khususnya leptospirosis, yang masih menjadi salah satu masalah kesehatan di Indonesia, terutama di wilayah pedesaan dengan aktivitas pertanian dan peternakan yang cukup tinggi.</p>
                <p>Berangkat dari kondisi tersebut, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan menyelenggarakan kegiatan <em>Edukasi DAGUSIBU, Swamedikasi, serta Pencegahan Leptospirosis dan Zoonosis</em> pada <em>13 Juli 2026</em> di <em>Balai Dusun Ngunut, Desa Tulakan, Kabupaten Pacitan</em>. Kegiatan ini dilaksanakan bersamaan dengan Posyandu Balita dan Posyandu Lansia sehingga dihadiri oleh masyarakat dari berbagai kelompok usia. Momen posyandu dimanfaatkan sebagai sarana untuk menyampaikan edukasi kesehatan karena menjadi salah satu kegiatan yang rutin diikuti oleh masyarakat Dusun Ngunut.</p>
                <p>Materi pertama membahas <strong>DAGUSIBU (Dapatkan, Gunakan, Simpan, dan Buang Obat dengan Benar)</strong>. Masyarakat diajak memahami pentingnya memperoleh obat dari sarana pelayanan kefarmasian yang resmi, menggunakan obat sesuai aturan pakai, menyimpan obat pada kondisi yang tepat agar kualitasnya tetap terjaga, serta membuang obat yang sudah rusak atau kedaluwarsa dengan cara yang aman.</p>
                <p>Selanjutnya, masyarakat mendapatkan edukasi mengenai <strong>swamedikasi</strong>, yaitu pengobatan mandiri untuk mengatasi keluhan ringan. Pada sesi ini dijelaskan cara memilih obat sesuai indikasi, membaca informasi pada kemasan, serta mengenali kondisi yang masih dapat ditangani sendiri dan kapan perlu memeriksakan diri ke tenaga kesehatan.</p>
                <p>Selain penggunaan obat, masyarakat juga memperoleh edukasi mengenai <strong>leptospirosis dan penyakit zoonosis</strong>. Materi yang disampaikan meliputi penyebab penyakit, cara penularan, gejala yang perlu diwaspadai, serta langkah-langkah pencegahan yang dapat diterapkan dalam kehidupan sehari-hari. Edukasi juga menekankan pentingnya menjaga kebersihan lingkungan, mengendalikan populasi tikus, menggunakan alat pelindung diri saat bekerja di area yang berisiko, serta segera memeriksakan diri ke fasilitas kesehatan apabila mengalami gejala yang mengarah pada leptospirosis.</p>
                <p>Kegiatan ini merupakan kolaborasi mahasiswa dari berbagai disiplin ilmu. Materi <em>DAGUSIBU</em> dan <em>swamedikasi</em> disampaikan oleh mahasiswa <em>Program Studi Farmasi</em>, sedangkan materi <em>zoonosis</em> dan <em>leptospirosis</em> dibawakan oleh mahasiswa <em>Program Studi Kedokteran Hewan (FKH)</em>. Kolaborasi lintas bidang ini menghadirkan edukasi yang lebih komprehensif mengenai penggunaan obat yang rasional sekaligus pencegahan penyakit yang berasal dari hewan.</p>
                <p>Sebagai pelengkap kegiatan edukasi, tim KKN juga memperkenalkan <strong>Peta Persebaran Risiko Zoonosis Desa Wonoanti</strong> yang disusun oleh mahasiswa <em>Program Studi Teknik Sipil</em> menggunakan <em>Sistem Informasi Geografis (SIG/GIS)</em>. Peta tersebut dibuat berdasarkan hasil survei lapangan dan menggambarkan wilayah yang memiliki potensi risiko zoonosis. Kehadirannya menjadi media edukasi sekaligus memberikan gambaran awal mengenai wilayah yang memiliki potensi risiko zoonosis sehingga dapat mendukung upaya peningkatan kewaspadaan masyarakat dan pemerintah desa.</p>
                <p>Antusiasme masyarakat terlihat sepanjang kegiatan berlangsung. Masyarakat tidak hanya menyimak materi, tetapi juga aktif mengajukan pertanyaan mengenai penggunaan antibiotik, cara menyimpan obat di rumah, hingga langkah-langkah pencegahan leptospirosis. Diskusi yang berlangsung hangat menunjukkan tingginya minat masyarakat terhadap informasi kesehatan yang dekat dengan kehidupan sehari-hari.</p>
                <p>Melalui kegiatan ini, Tim KKN-PPM UGM Unit Tilik Tulakan berharap masyarakat semakin memahami pentingnya pengelolaan obat yang benar, mampu melakukan swamedikasi secara rasional, serta lebih waspada terhadap penyakit zoonosis. Pengetahuan yang diperoleh selama kegiatan diharapkan dapat diterapkan dalam kehidupan sehari-hari sehingga mampu mendukung terwujudnya masyarakat yang lebih sehat, mandiri, dan peduli terhadap kesehatan lingkungan.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_umkm: {
            tag: 'Kegiatan Proker',
            title: 'Eksplorasi Profil UMKM & Potensi Usaha Rumahan',
            image: 'assets/images/proker_umkm.png',
            desc: `
                <p>Program kerja ini merupakan kegiatan yang bertujuan untuk mengeksplorasi, mengidentifikasi, serta mempublikasikan potensi ekonomi lokal Desa Wonoanti dan sekitarnya melalui media digital seperti website yang dapat diakses oleh masyarakat luas. Kegiatan ini dilatarbelakangi oleh banyaknya pelaku UMKM dan usaha rumahan di Desa Wonoanti yang memiliki produk unggulan berbasis sumber daya lokal, seperti gula kelapa, kopi lokal, tempe, rengginang, keripik, jamu tradisional, kue tradisional, hingga produk kerajinan. Meskipun memiliki potensi yang besar, sebagian besar pelaku usaha masih mengandalkan pemasaran secara konvensional melalui pengepul, pasar tradisional, maupun jaringan pelanggan tetap sehingga jangkauan promosi produk masih relatif terbatas.</p>
                <p>Melalui program ini, mahasiswa KKN-PPM UGM Unit Tilik Tulakan melakukan pendataan secara langsung terhadap UMKM dan kepala dusun tiap dusun untuk mencari usaha rumahan yang tersedia di Desa Wonoanti. Proses pendataan dilakukan melalui observasi lapangan dan wawancara untuk memperoleh informasi mengenai jenis produk, potensi yang dimiliki, hingga tantangan yang dihadapi dalam mengembangkan usahanya. Informasi tersebut kemudian disusun menjadi profil UMKM yang sistematis dan informatif sehingga dapat memberikan gambaran yang komprehensif mengenai potensi ekonomi desa.</p>
                <p>Selanjutnya, hasil pendataan diolah menjadi konten digital berupa artikel profil singkat yang akan dipublikasikan pada website resmi Desa Wonoanti. Setiap profil dirancang agar memberikan informasi potensi usaha rumahan yang ada di tiap dusun di Desa Wonoanti dan sekitarnya sehingga dapat meningkatkan daya tarik bagi masyarakat, wisatawan, calon konsumen, maupun pihak-pihak yang berpotensi menjalin kerja sama dengan pelaku UMKM. Dengan adanya publikasi digital ini, website desa diharapkan menjadi media promosi yang mampu memperkenalkan potensi ekonomi lokal secara lebih luas sekaligus menjadi pusat informasi mengenai UMKM yang ada di Desa Wonoanti.</p>
                <p>Selain mendukung promosi digital, program kerja ini juga bertujuan menciptakan basis data UMKM yang dapat dimanfaatkan oleh pemerintah desa sebagai bahan perencanaan pembangunan ekonomi, penyusunan program pemberdayaan masyarakat, maupun pengembangan sektor usaha mikro di masa mendatang. Profil UMKM yang telah disusun dapat terus diperbarui secara berkala sehingga website desa memiliki informasi yang selalu relevan dan dapat dimanfaatkan secara berkelanjutan setelah program KKN berakhir.</p>
                <p>Melalui pelaksanaan program ini, mahasiswa KKN-PPM UGM Unit Tilik Tulakan diharapkan dapat memberikan kontribusi nyata dalam mendukung transformasi digital desa, memperkuat branding produk lokal, meningkatkan eksistensi UMKM di era digital, serta membuka peluang pemasaran yang lebih luas bagi pelaku usaha. Dengan demikian, program ini tidak hanya menghasilkan dokumentasi profil UMKM sebagai luaran kegiatan KKN, tetapi juga menjadi instrumen penting bagi penguatan ekonomi masyarakat Desa Wonoanti yang mandiri, berdaya saing, dan berkelanjutan.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_senam: {
            tag: 'Kegiatan Proker',
            title: 'Senam Persendian & Cek Kesehatan Lansia',
            image: 'assets/images/proker_senam.png',
            desc: `
                <p>Menjaga kesehatan di usia lanjut memerlukan perhatian khusus, salah satunya melalui aktivitas fisik yang sesuai serta pemeriksaan kesehatan secara berkala. Senam persendian menjadi salah satu bentuk olahraga ringan yang bermanfaat untuk membantu menjaga kelenturan sendi, meningkatkan keseimbangan tubuh, dan mengurangi risiko kekakuan otot pada lansia. Di sisi lain, pemeriksaan kesehatan rutin juga berperan penting sebagai upaya deteksi dini berbagai penyakit tidak menular yang umum dialami kelompok lanjut usia.</p>
                <p>Sebagai bentuk dukungan terhadap upaya promotif and preventif di masyarakat, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan turut berpartisipasi dalam kegiatan pemeriksaan kesehatan rutin yang diselenggarakan di <em>Dusun Ngunut.</em> Kegiatan yang dilaksanakan pada <em>1 Juli 2026</em> di <em>Balai Dusun Ngunut, Desa Wonoanti, Kabupaten Pacitan</em> ini diawali dengan <em>senam persendian</em> bersama yang dipandu oleh mahasiswa KKN. Kegiatan diikuti oleh sekitar <strong>100 masyarakat lansia Dusun Ngunut</strong> dengan penuh semangat dan antusias.</p>
                <p>Senam persendian menjadi pembuka rangkaian kegiatan sebagai upaya mengajak para lansia tetap aktif bergerak sesuai kemampuan fisik mereka. Gerakan-gerakan yang dilakukan sederhana, mudah diikuti, dan difokuskan untuk menjaga kesehatan persendian, meningkatkan fleksibilitas tubuh, serta mendukung kebugaran lansia agar tetap dapat menjalankan aktivitas sehari-hari secara mandiri.</p>
                <p>Setelah senam selesai, peserta mengikuti <strong>pemeriksaan kesehatan gratis</strong> yang meliputi <strong>pengukuran tekanan darah</strong>, <strong>pemeriksaan kadar gula darah</strong>, <strong>pemeriksaan kesehatan mata</strong>, serta <strong>pemeriksaan kesehatan gigi</strong>. Pemeriksaan ini merupakan kegiatan rutin yang dilaksanakan setiap periode sebagai bagian dari pelayanan kesehatan masyarakat, dengan pelaksanaan oleh tenaga kesehatan dari <strong>Polindes Wonoanti</strong> dan didukung oleh mahasiswa KKN-PPM UGM Tilik Tulakan.</p>
                <p>Melalui pemeriksaan kesehatan berkala ini, masyarakat dapat memantau kondisi kesehatannya secara rutin sekaligus memperoleh deteksi dini terhadap faktor risiko berbagai penyakit. Setelah pemeriksaan, peserta juga diberikan edukasi singkat mengenai pentingnya menjaga pola makan bergizi seimbang, tetap aktif berolahraga, mematuhi anjuran penggunaan obat dari tenaga kesehatan, serta melakukan pemeriksaan kesehatan secara berkala. Masyarakat juga memanfaatkan kesempatan tersebut untuk berkonsultasi langsung mengenai hasil pemeriksaan yang diperoleh.</p>
                <p>Kegiatan berlangsung dengan lancar dan mendapat sambutan positif dari para lansia. Kehadiran mahasiswa KKN tidak hanya membantu kelancaran pelaksanaan kegiatan, tetapi juga menjadi bentuk dukungan terhadap pelayanan kesehatan yang telah rutin dilaksanakan di <em>Dusun Ngunut.</em> Melalui kolaborasi antara Tim KKN-PPM UGM Tilik Tulakan dan <strong>Polindes Wonoanti</strong>, diharapkan kesadaran masyarakat, khususnya para lansia, terhadap pentingnya menjaga kesehatan melalui aktivitas fisik dan pemeriksaan kesehatan berkala semakin meningkat.</p>
                <p>Melalui kegiatan ini, Tim KKN-PPM UGM Tilik Tulakan berharap <strong>masyarakat lansia Dusun Ngunut</strong> semakin termotivasi untuk menerapkan pola hidup sehat dan memanfaatkan layanan pemeriksaan kesehatan rutin sebagai langkah pencegahan penyakit. Sinergi antara perguruan tinggi, tenaga kesehatan, dan masyarakat diharapkan terus terjalin dalam mewujudkan lansia yang sehat, aktif, mandiri, dan produktif.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_voli: {
            tag: 'Kegiatan Warga',
            title: 'Gotong Royong Revitalisasi Lapangan Voli Desa Duren',
            image: 'assets/images/proker_voli.jpg',
            desc: `
                <p>Lapangan voli menjadi salah satu fasilitas yang sering dimanfaatkan masyarakat Desa Duren, Wonoanti, untuk berolahraga maupun berkumpul. Agar tetap nyaman digunakan, diperlukan perawatan secara berkala. Berangkat dari hal tersebut, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan mengadakan kegiatan kerja bakti dan revitalisasi Lapangan Voli Desa Duren pada 12 Juli 2026 bersama warga setempat.</p>
                <p>Kegiatan diawali dengan kerja bakti membersihkan area lapangan. Mahasiswa KKN bersama warga membersihkan daun-daun kering, rumput liar, serta merapikan lingkungan sekitar lapangan agar lebih bersih dan nyaman. Suasana gotong royong berlangsung hangat dengan partisipasi aktif masyarakat yang turut membantu sejak pagi.</p>
                <p>Setelah proses pembersihan selesai, kegiatan dilanjutkan dengan revitalisasi lapangan melalui pengecatan ulang. Mahasiswa KKN bersama beberapa pemuda desa membuat mural dan mempertegas garis lapangan menggunakan warna-warna cerah sehingga tampilan lapangan menjadi lebih menarik. Proses pengecatan dilakukan bersama-sama dengan penuh semangat hingga menghasilkan lapangan yang tampak lebih hidup.</p>
                <p>Kegiatan ini tidak hanya bertujuan mempercantik lapangan, tetapi juga mengajak masyarakat untuk bersama-sama menjaga fasilitas umum yang ada di desa. Dengan kondisi lapangan yang lebih baik, diharapkan masyarakat, terutama anak-anak dan para pemuda, semakin termotivasi untuk berolahraga dan memanfaatkan lapangan sebagai ruang berkegiatan.</p>
                <p>Selama kegiatan berlangsung, terlihat kebersamaan yang terjalin antara mahasiswa KKN dan masyarakat. Mulai dari membersihkan lapangan, menyiapkan cat, hingga mengecat mural dilakukan secara gotong royong. Semangat kebersamaan inilah yang menjadi salah satu nilai penting dalam pelaksanaan KKN, yaitu membangun desa melalui kolaborasi dengan masyarakat.</p>
                <p>Melalui kegiatan revitalisasi ini, Tim KKN-PPM UGM Unit Tilik Tulakan berharap Lapangan Voli Desa Duren dapat menjadi fasilitas yang lebih nyaman, indah, dan bermanfaat bagi masyarakat. Selain itu, kegiatan ini juga diharapkan dapat menumbuhkan kepedulian bersama untuk terus merawat fasilitas umum sehingga dapat digunakan dalam jangka waktu yang panjang.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_kambing: {
            tag: 'Kegiatan Proker',
            title: 'Pemberian Vitamin & Recording Ternak Kambing',
            image: 'assets/images/proker_kambing.jpg',
            desc: `
                <p>Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode 2 Tahun 2026 melaksanakan program kerja bidang Kedokteran Hewan berupa pemberian vitamin dan <em>recording</em> ternak kambing di Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan. Kegiatan ini diselenggarakan sebagai bentuk upaya promotif dalam meningkatkan kesehatan dan kesejahteraan hewan ternak sekaligus mendukung pengelolaan data peternakan masyarakat.</p>
                <p>Pelaksanaan kegiatan berlangsung selama dua hari, yaitu pada <em>9 Juli 2026</em> di Dusun Sriten, Bulih, dan Pojok, kemudian dilanjutkan pada <em>10 Juli 2026</em> di Dusun Duren dan Ngunut. Program ini terlaksana melalui kolaborasi antara mahasiswa KKN-PPM UGM dengan <strong>Dinas Ketahanan Pangan dan Pertanian Kabupaten Pacitan</strong>, yang memberikan pendampingan teknis selama kegiatan berlangsung.</p>
                <p>Kegiatan diawali dengan pemeriksaan kondisi umum kambing untuk memastikan kondisi kesehatan ternak sebelum dilakukan pemberian vitamin. Pemeriksaan meliputi pengamatan kondisi fisik, respons ternak, serta identifikasi gejala-gejala yang berpotensi mengarah pada gangguan kesehatan. Langkah ini menjadi bagian penting dalam memastikan bahwa pelayanan kesehatan hewan dilakukan secara tepat dan sesuai dengan kondisi ternak.</p>
                <p>Pemberian vitamin dilakukan sebagai salah satu upaya preventif untuk menjaga kesehatan ternak kambing. Asupan vitamin yang memadai berperan dalam meningkatkan daya tahan tubuh, mendukung proses metabolisme, serta membantu menjaga produktivitas ternak. Melalui kegiatan ini, diharapkan kambing yang dipelihara masyarakat memiliki kondisi kesehatan yang lebih baik sehingga mampu menunjang keberlanjutan usaha peternakan rakyat di Desa Wonoanti.</p>
                <p>Selain pelayanan kesehatan, mahasiswa juga melaksanakan <strong>recording</strong> atau pendataan ternak kambing. Proses ini meliputi pencatatan jumlah ternak, jenis kelamin, perkiraan umur, kondisi kesehatan, hingga identitas pemilik ternak. Pendataan tersebut diharapkan dapat menjadi informasi dasar yang bermanfaat bagi pemerintah desa maupun instansi terkait dalam merancang program pembinaan dan pengembangan sektor peternakan secara lebih terarah.</p>
                <p>Antusiasme masyarakat terlihat sejak awal pelaksanaan kegiatan. Para peternak secara aktif membawa dan mendampingi ternaknya selama proses pemeriksaan, pemberian vitamin, dan pendataan berlangsung. Kehadiran masyarakat yang tinggi menunjukkan meningkatnya kesadaran akan pentingnya menjaga kesehatan ternak sebagai salah satu aset ekonomi keluarga.</p>
                <p>Tidak hanya memberikan pelayanan kesehatan, mahasiswa KKN juga memanfaatkan kesempatan tersebut untuk berdiskusi bersama para peternak mengenai manajemen pemeliharaan kambing. Edukasi yang diberikan mencakup pentingnya penyediaan pakan yang berkualitas, kebersihan kandang, pencegahan penyakit, serta pemantauan kondisi kesehatan ternak secara berkala.</p>
                <p>Kolaborasi dengan Dinas Ketahanan Pangan dan Pertanian Kabupaten Pacitan menjadi salah satu faktor penting dalam keberhasilan kegiatan ini. Sinergi antara perguruan tinggi, pemerintah daerah, dan masyarakat memungkinkan pelaksanaan program berjalan secara efektif sekaligus memperkuat upaya peningkatan kualitas pelayanan kesehatan hewan di tingkat desa. Kehadiran tenaga teknis dari dinas juga memberikan kesempatan bagi mahasiswa untuk belajar secara langsung mengenai implementasi pelayanan veteriner di lapangan.</p>
                <p>Program ini merupakan wujud implementasi peran bidang Kedokteran Hewan dalam mendukung promosi kesehatan hewan (<em>animal health promotion</em>) melalui pendekatan promotif dan preventif. Upaya menjaga kesehatan ternak sejak dini diharapkan mampu mengurangi risiko timbulnya penyakit, meningkatkan kesejahteraan hewan (<em>animal welfare</em>), serta mendukung produktivitas peternakan masyarakat secara berkelanjutan.</p>
                <p>Bagi mahasiswa KKN-PPM UGM, kegiatan ini menjadi sarana penerapan ilmu yang diperoleh selama perkuliahan sekaligus pengalaman berharga dalam berinteraksi dengan masyarakat. Melalui kegiatan ini, mahasiswa tidak hanya memberikan pelayanan kesehatan hewan, tetapi juga belajar memahami kondisi peternakan rakyat serta pentingnya kolaborasi lintas sektor dalam mendukung pembangunan masyarakat berbasis potensi lokal.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_phbs: {
            tag: 'Kegiatan Proker',
            title: 'Edukasi PHBS Melalui Cuci Tangan & Pemilahan Sampah',
            image: 'assets/images/proker_phbs.jpg',
            desc: `
                <p>Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode 2 Tahun 2026 Tim KKN-PPM UGM Sub Unit Wonoanti melaksanakan kegiatan edukasi Perilaku Hidup Bersih dan Sehat (PHBS) di MI Muhammadiyah 2 Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan. Kegiatan yang dilaksanakan dalam rangkaian Masa Pengenalan Lingkungan Sekolah (MPLS) ini bertujuan untuk meningkatkan pemahaman dan kesadaran siswa mengenai pentingnya menjaga kebersihan diri dan lingkungan melalui praktik mencuci tangan yang benar serta pemilahan sampah organik dan nonorganik.</p>
                <p>Kegiatan edukasi PHBS diawali dengan penyampaian materi mengenai pentingnya menerapkan kebiasaan hidup bersih dan sehat dalam kehidupan sehari-hari. Mahasiswa KKN mengajak siswa untuk mengenali berbagai perilaku sederhana yang dapat dilakukan untuk menjaga kesehatan diri dan lingkungan, seperti mencuci tangan dengan sabun, menjaga kebersihan lingkungan sekolah, serta membuang dan memilah sampah sesuai dengan jenisnya. Materi disampaikan secara interaktif dan komunikatif agar dapat dipahami dengan mudah oleh para siswa.</p>
                <p>Salah satu kegiatan utama dalam edukasi PHBS adalah praktik mencuci tangan dengan sabun dan air mengalir. Mahasiswa memberikan penjelasan mengenai pentingnya mencuci tangan sebagai salah satu upaya untuk menjaga kebersihan diri dan mencegah penyebaran penyakit. Setelah mendapatkan materi, siswa diajak untuk mempraktikkan tahapan mencuci tangan yang benar secara bersama-sama.</p>
                <p>Agar kegiatan praktik berlangsung lebih menyenangkan dan mudah diingat, tahapan mencuci tangan dikemas melalui lagu dan gerakan sederhana. Siswa diajak untuk bernyanyi sambil mengikuti gerakan mencuci tangan sesuai dengan tahapan yang telah diperagakan oleh mahasiswa. Penggunaan lagu dalam kegiatan ini diharapkan dapat membantu siswa mengingat langkah-langkah mencuci tangan dengan lebih mudah sekaligus menciptakan suasana pembelajaran yang ceria dan interaktif.</p>
                <p>Selain edukasi mengenai kebersihan tangan, kegiatan juga dilanjutkan dengan pengenalan pemilahan sampah organik dan nonorganik. Mahasiswa memberikan penjelasan mengenai perbedaan kedua jenis sampah tersebut beserta contoh-contohnya yang sering dijumpai dalam kehidupan sehari-hari. Siswa diperkenalkan dengan sampah organik seperti sisa makanan dan daun, serta sampah nonorganik seperti botol plastik dan kemasan makanan.</p>
                <p>Untuk meningkatkan pemahaman siswa, materi pemilahan sampah disampaikan melalui kegiatan interaktif berupa permainan edukatif. Siswa diajak untuk mengenali berbagai jenis sampah dan menentukan kategori yang sesuai, yaitu sampah organik atau nonorganik. Melalui kegiatan tersebut, siswa dapat belajar secara langsung mengenai pentingnya memilah sampah sejak dari sumbernya sekaligus memahami bahwa kebiasaan sederhana tersebut merupakan bagian dari upaya menjaga kebersihan dan kelestarian lingkungan.</p>
                <p>Antusiasme siswa terlihat selama kegiatan berlangsung. Para siswa secara aktif mengikuti penyampaian materi, bernyanyi dan mempraktikkan gerakan mencuci tangan, serta berpartisipasi dalam kegiatan pemilahan sampah. Interaksi antara mahasiswa dan siswa juga berlangsung secara aktif melalui sesi tanya jawab dan permainan, sehingga kegiatan edukasi tidak hanya berfokus pada penyampaian materi, tetapi juga mendorong siswa untuk berpartisipasi secara langsung dalam proses pembelajaran.</p>
                <p>Kegiatan PHBS ini menjadi salah satu upaya mahasiswa KKN-PPM UGM dalam menanamkan kebiasaan hidup bersih dan sehat sejak usia dini. Kebiasaan mencuci tangan dengan benar dan memilah sampah diharapkan dapat diterapkan oleh siswa tidak hanya selama berada di lingkungan sekolah, tetapi juga dalam kehidupan sehari-hari di rumah dan lingkungan masyarakat.</p>
                <p>Pelaksanaan kegiatan dalam rangkaian MPLS juga menjadi momentum yang tepat untuk memperkenalkan budaya hidup bersih dan sehat kepada siswa sejak awal memasuki lingkungan sekolah. Dengan pemahaman yang diberikan secara interaktif dan menyenangkan, siswa diharapkan dapat menjadi agen perubahan kecil yang mampu mengajak teman dan keluarga untuk turut menerapkan kebiasaan menjaga kebersihan diri serta lingkungan.</p>
                <p>Keberlanjutan kegiatan PHBS diharapkan dapat didukung melalui pembiasaan perilaku hidup bersih dan sehat secara rutin di lingkungan sekolah. Pihak sekolah, guru, dan siswa dapat bersama-sama menjaga kebersihan lingkungan, menerapkan kebiasaan mencuci tangan, serta melakukan pemilahan sampah organik dan nonorganik secara konsisten. Dengan adanya pembiasaan tersebut, edukasi yang diberikan tidak berhenti sebagai kegiatan selama MPLS, tetapi dapat berkembang menjadi budaya positif yang diterapkan oleh seluruh warga sekolah.</p>
                <p>Melalui kegiatan edukasi PHBS di MIM 2 Wonoanti, Tim KKN-PPM UGM Sub Unit Wonoanti berharap dapat memberikan kontribusi dalam meningkatkan kesadaran siswa mengenai pentingnya menjaga kesehatan diri dan lingkungan. Pengenalan kebiasaan mencuci tangan yang benar dan pemilahan sampah sejak dini diharapkan dapat membentuk generasi yang lebih peduli terhadap kesehatan, kebersihan, dan kelestarian lingkungan. Dengan demikian, kegiatan ini diharapkan dapat menjadi langkah awal dalam mewujudkan lingkungan sekolah yang bersih, sehat, nyaman, dan mendukung tumbuh kembang siswa secara optimal.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_apoteker: {
            tag: 'Kegiatan Proker',
            title: 'Program Apoteker Cilik & Edukasi Obat Sekolah',
            image: 'assets/images/proker_apoteker.jpg',
            desc: `
                <p>Menanamkan kesadaran akan pentingnya kesehatan dapat dimulai sejak usia sekolah. Selain membiasakan perilaku hidup bersih dan sehat, anak-anak juga perlu mengenal berbagai profesi tenaga kesehatan agar memahami peran masing-masing dalam menjaga kesehatan masyarakat. Salah satunya adalah apoteker, profesi yang berperan dalam memastikan obat digunakan secara tepat, aman, dan rasional.</p>
                <p>Untuk mengenalkan profesi tersebut, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan menggelar program <em>Apoteker Cilik</em> pada <em>15 Juli 2026</em> di <em>SDIT Al Wakil Wonoanti</em>, Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan. Kegiatan ini diikuti oleh siswa-siswi kelas VI yang antusias mengikuti setiap rangkaian acara.</p>
                <p>Kegiatan diawali dengan <strong>Detektif Lingkungan Sehat</strong>. Siswa-siswi dibagi ke dalam beberapa kelompok dan diajak berkeliling lingkungan sekolah sambil membawa lembar observasi. Mereka mengamati kondisi lingkungan, mencari potensi sumber penyakit, lalu mencatat dan mempresentasikan hasil temuannya. Melalui kegiatan ini, siswa-siswi belajar bahwa menjaga kebersihan lingkungan merupakan salah satu cara sederhana untuk mencegah penyakit.</p>
                <p>Dari hasil pengamatan tersebut, mahasiswa KKN mengajak siswa-siswi berdiskusi tentang pentingnya menjaga kesehatan dan memperkenalkan berbagai tenaga kesehatan yang berperan dalam kehidupan sehari-hari. Salah satunya adalah <strong>apoteker</strong>. Dengan penyampaian yang sederhana dan disertai contoh-contoh yang dekat dengan keseharian, siswa-siswi diajak mengenal tugas apoteker dalam memastikan obat yang diterima masyarakat aman, bermutu, dan digunakan dengan benar.</p>
                <p>Setelah itu, siswa-siswi mengikuti praktik sederhana kefarmasian. Mereka diperkenalkan dengan beberapa alat yang digunakan di bidang farmasi, kemudian secara bergantian mencoba menggerus tablet menggunakan mortir dan stamper, serta melakukan simulasi pembuatan puyer dan kapsul. Praktik ini memberikan pengalaman baru sekaligus gambaran mengenai salah satu keterampilan yang dimiliki seorang apoteker.</p>
                <p>Suasana semakin meriah saat sesi kuis interaktif dimulai. Siswa-siswi tampak antusias menjawab berbagai pertanyaan seputar profesi apoteker dan penggunaan obat yang benar. Sebagai bentuk apresiasi, Tim KKN-PPM UGM Unit Tilik Tulakan memberikan hadiah kepada siswa-siswi yang berhasil menjawab pertanyaan dengan tepat sehingga suasana belajar menjadi semakin seru dan menyenangkan.</p>
                <p>Melalui program ini, Tim KKN-PPM UGM Unit Tilik Tulakan berharap siswa-siswi SDIT Al Wakil Wonoanti semakin mengenal profesi apoteker, memahami pentingnya penggunaan obat yang benar, serta termotivasi untuk menerapkan perilaku hidup bersih dan sehat dalam kehidupan sehari-hari.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_kompos: {
            tag: 'Kegiatan Proker',
            title: 'Pelatihan Kompos & Silase Pakan Ternak',
            image: 'assets/images/proker_kompos.jpg',
            desc: `
                <p>Sektor peternakan memegang peranan penting dalam penggerak ekonomi masyarakat pedesaan, di mana mayoritas penduduknya berprofesi sebagai petani dan peternak. Namun, seiring berjalannya waktu, para peternak menghadapi dua tantangan utama yang saling berkaitan: peningkatan volume limbah kotoran ternak yang berpotensi mencemari lingkungan, serta fluktuasi ketersediaan pakan hijauan berkualitas terutama saat memasuki musim kemarau. Jika limbah feses tidak dikelola dengan baik, penumpukannya akan memicu pencemaran udara dan sarang penyakit. Di sisi lain, melimpahnya hijauan di musim hujan seringkali terbuang membusuk, sementara peternak harus mengeluarkan tenaga ekstra untuk mencari pakan saat pasokan merosot tajam.</p>
                <p>Sebagai bentuk dukungan nyata terhadap penyelesaian kedua masalah tersebut sekaligus memberdayakan masyarakat, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode 2 Tahun 2026 Tim KKN-PPM UGM Sub Unit Wonoanti menyelenggarakan kegiatan sosialisasi dan pelatihan terpadu. Berlokasi di Dusun Sriten, Desa Wonoanti, Kabupaten Pacitan, Jawa Timur, kegiatan yang dilaksanakan pada tanggal 5 Juli 2026 ini menggabungkan pelatihan pembuatan pupuk kompos dengan praktik pembuatan pakan fermentasi (silase). Kegiatan ini diawali dengan diskusi interaktif yang dipandu oleh mahasiswa KKN, dan diikuti oleh 15 orang peternak setempat dengan penuh semangat serta antusiasme yang sangat seru.</p>
                <p>Pada sesi pertama, kegiatan difokuskan pada pengolahan limbah kotoran hewan menjadi pupuk organik yang berkualitas. Tahapan dimulai dengan pendataan potensi limbah dari masing-masing peternak, meliputi jenis ternak yang mendominasi, sistem pembersihan kandang, serta ketersediaan bahan karbon tambahan seperti jerami, sekam, atau dedaunan kering. Observasi bersama ini menjadi landasan krusial bagi mahasiswa dan warga dalam menentukan formulasi kompos serta jenis bioaktivator yang paling sesuai dengan melimpahnya bahan baku lokal di wilayah Dusun Sriten.</p>
                <p>Proses pembuatan kompos tersebut diaplikasikan menggunakan metode fermentasi aerobik. Feses ternak yang kaya akan nitrogen dicampur dengan limbah pertanian sebagai sumber karbon untuk mencapai rasio C/N yang ideal, lalu ditambahkan cairan bioaktivator dan molase untuk mempercepat proses dekomposisi. Selama proses berlangsung, kompos akan melewati tiga fase utama: fase mesofilik di dua minggu pertama untuk mengurai senyawa, fase termofilik di mana suhu memuncak hingga 60°C yang krusial untuk mematikan bakteri patogen agen penyakit dan biji gulma, serta diakhiri dengan fase pematangan di mana suhu menurun dan kompos berubah menjadi kehitaman dengan bau khas tanah yang subur.</p>
                <p>Pupuk kompos yang dihasilkan dari tahapan panjang ini tidak hanya bertugas sebagai penyedia unsur hara makro dan mikro bagi tanaman, tetapi juga berperan penting sebagai pembenah tanah (<em>soil conditioner</em>). Penggunaan kompos secara rutin terbukti mampu memperbaiki struktur tanah dan merangsang aktivitas mikroorganisme yang menguntungkan. Keterampilan ini memberikan wawasan baru bagi peternak Dusun Sriten bahwa kesehatan ternak, sanitasi kandang, dan produktivitas sektor pertanian sebenarnya adalah satu kesatuan siklus yang saling menguntungkan secara ekologis.</p>
                <p>Memasuki sesi kedua, mahasiswa KKN memberikan solusi atas permasalahan ketersediaan pakan melalui pengenalan inovasi silase. Pembuatan silase diperkenalkan sebagai teknologi pengawetan pakan yang mampu menyimpan hijauan dalam jangka waktu panjang tanpa menurunkan nilai nutrisinya. Silase bekerja dengan memanfaatkan proses fermentasi oleh Bakteri Asam Laktat (<em>Lactobacillus spp.</em>) dalam kondisi kedap udara (anaerob) dan suasana asam dengan target pH 3,8–4,2 guna menghambat berkembangnya mikroba pembusuk.</p>
                <p>Materi yang disampaikan dalam sesi pakan ini mencakup pemilihan bahan baku serta komposisi formulasi yang ideal. Masyarakat diberikan pemahaman bahwa silase berkualitas tinggi dapat dibuat dari kombinasi rumput (seperti rumput gajah, odot, atau Pakchong) sebanyak 60%, hijauan leguminosa (seperti Indigofera, lamtoro, gamal) sebesar 30%, serta dedak halus sebesar 10%. Selain itu, bahan tambahan pelengkap seperti molases (2%), garam (0,5%), serta starter EM4 dicampurkan dengan air secukupnya untuk mendukung keberhasilan proses fermentasi.</p>
                <p>Mahasiswa KKN kemudian memandu langsung tahapan praktik pembuatan silase bersama para peternak. Langkah-langkahnya diawali dengan mencacah hijauan menggunakan mesin <em>chopper</em> hingga berukuran 2–5 cm agar mudah dipadatkan. Hijauan tersebut dicampur merata dengan konsentrat dan bahan starter, lalu dimasukkan ke dalam drum secara bertahap sambil diinjak dan dipadatkan dengan kuat agar tidak ada udara yang tersisa. Setelah drum ditutup rapat secara anaerob, proses pemeraman (<em>ensilage</em>) dibiarkan berlangsung selama 21 hari hingga silase matang dan siap dipanen.</p>
                <p>Sebagai panduan praktis perawatan sehari-hari, peserta juga dibekali pengetahuan mengenai ciri-ciri keberhasilan silase. Silase yang baik ditandai dengan warna hijau kekuningan segar, aroma asam khas fermentasi, tekstur lembut, serta kadar air ideal di kisaran 60–70%; berbeda dengan silase gagal yang akan berbau busuk, berlendir, dan ditumbuhi jamur. Peternak juga diimbau untuk memberikan pakan fermentasi ini secara bertahap dan dicampurkan bersama hijauan segar di masa awal adaptasi, agar sistem pencernaan ternak tidak kaget.</p>
                <p>Melalui rangkaian pelatihan interaktif yang penuh antusiasme ini, Tim KKN-PPM UGM Tilik Tulakan berharap masyarakat Dusun Sriten dan Desa Wonoanti secara menyeluruh dapat mengaplikasikan pengelolaan limbah feses dan teknologi silase secara mandiri. Sinergi berkelanjutan antara masyarakat peternak, pemerintah desa, dan perguruan tinggi ini diyakini mampu menekan biaya operasional pembelian pupuk kimia, efisiensi waktu pemeliharaan ternak, serta mewujudkan sistem peternakan desa yang tangguh dan mandiri sepanjang tahun.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_toga: {
            tag: 'Kegiatan Proker',
            title: 'Edukasi TOGA & Budidaya Hidroponik bagi Ibu PKK',
            image: 'assets/images/proker_toga.jpg',
            desc: `
                <p>Tanaman Obat Keluarga (TOGA) merupakan salah satu potensi lokal yang dapat dimanfaatkan untuk mendukung kesehatan keluarga sekaligus meningkatkan kemandirian masyarakat dalam menjaga kesehatan. Berbagai tanaman yang mudah dibudidayakan di sekitar rumah memiliki manfaat sebagai pendukung upaya promotif dan preventif apabila dimanfaatkan secara tepat. Oleh karena itu, edukasi mengenai budidaya dan pemanfaatan TOGA menjadi penting agar masyarakat mampu memanfaatkan potensi lokal secara optimal untuk kesehatan.</p>
                <p>Sebagai bentuk pemberdayaan masyarakat, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan menyelenggarakan kegiatan Pemanfaatan Tanaman Obat untuk Kesehatan Masyarakat pada 19 Juli 2026 di Rumah Kepala Dusun Sriten, Desa Wonoanti, Kabupaten Pacitan. Kegiatan ini diikuti oleh sekitar <strong>25 peserta</strong> yang terdiri atas <strong>Ibu-Ibu PKK Dusun Sriten perwakilan dari setiap RT</strong>. Kehadiran para peserta diharapkan dapat menjadi perpanjangan tangan dalam menyebarluaskan informasi kepada masyarakat di lingkungan masing-masing.</p>
                <p>Kegiatan diawali dengan edukasi mengenai budidaya tanaman obat menggunakan <strong>media tanam hidroponik</strong> sebagai alternatif bagi masyarakat yang memiliki keterbatasan lahan. Peserta dikenalkan dengan konsep hidroponik, cara penanaman, perawatan, serta pemanfaatannya untuk membudidayakan tanaman obat keluarga. Untuk mendukung praktik budidaya di lingkungan masyarakat, Tim KKN-PPM UGM juga <strong>menyerahkan enam media tanam hidroponik yang dapat dimanfaatkan bersama oleh warga.</strong></p>
                <p>Selanjutnya, peserta mengikuti sesi <strong>edukasi mengenai Tanaman Obat Keluarga (TOGA)</strong> yang diawali dengan pemaparan <strong>data kesehatan masyarakat Dusun Sriten</strong> berdasarkan data hasil wawancara dengan <strong>Kader Posyandu Desa Wonoanti.</strong> Melalui pemaparan tersebut, peserta diajak memahami berbagai permasalahan kesehatan yang banyak dijumpai di masyarakat sehingga diperlukan upaya pencegahan melalui penerapan pola hidup sehat dan pemanfaatan tanaman obat keluarga.</p>
                <p>Kegiatan kemudian dilanjutkan dengan pembahasan mengenai berbagai jenis <strong>tanaman TOGA yang mudah ditemukan di lingkungan sekitar</strong>, disertai penjelasan mengenai mitos dan fakta penggunaan tanaman obat agar masyarakat mampu memilah informasi yang benar. Selain itu, peserta juga memperoleh edukasi mengenai pemanfaatan beberapa tanaman obat sebagai <strong>pendukung kesehatan pada hipertensi dan diabetes,</strong> dengan penekanan bahwa TOGA digunakan sebagai pelengkap dalam menjaga kesehatan dan bukan sebagai pengganti pengobatan maupun konsultasi dengan tenaga kesehatan.</p>
                <p>Kegiatan berlangsung secara interaktif melalui sesi tanya jawab, di mana peserta aktif menyampaikan pengalaman serta berdiskusi mengenai pemanfaatan tanaman obat di lingkungan sekitar. Untuk memperkuat pemahaman peserta, Tim KKN-PPM UGM membagikan booklet Pemanfaatan Tanaman Obat Keluarga (TOGA) yang berisi informasi mengenai manfaat tanaman obat, cara budidaya, serta penggunaannya secara bijak.</p>
                <p>Sebagai penutup rangkaian edukasi, mahasiswa KKN mendemonstrasikan <strong>pembuatan puding berbahan dasar daun kemangi sebagai salah satu inovasi pemanfaatan tanaman TOGA</strong> menjadi olahan pangan yang sehat, bergizi, dan mudah dibuat di rumah. Setelah demonstrasi selesai, puding kemangi dibagikan kepada warga sehingga mereka dapat langsung mencicipi hasil olahan sekaligus memperoleh inspirasi untuk mengolah tanaman obat menjadi produk yang lebih menarik dan bernilai tambah.</p>
                <p>Kegiatan kemudian ditutup dengan sesi dokumentasi bersama. Melalui kegiatan ini, kami berharap para Ibu PKK perwakilan RT dapat menjadi agen edukasi di lingkungan masing-masing sehingga pengetahuan mengenai budidaya dan pemanfaatan TOGA dapat diterapkan dan disebarluaskan kepada masyarakat serta mampu mewujudkan budaya hidup sehat <strong>berbasis potensi lokal yang berkelanjutan.</strong></p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_sdn2: {
            tag: 'Kegiatan Proker',
            title: 'Edukasi Gizi & Alat Filtrasi Air Bersih SDN 2',
            image: 'assets/images/proker_sdn2.jpg',
            desc: `
                <p>Pendidikan kesehatan sejak usia dini menjadi salah satu langkah penting dalam membentuk kebiasaan hidup sehat pada anak. Melalui metode pembelajaran yang interaktif dan menyenangkan, siswa dapat lebih mudah memahami pentingnya mengonsumsi makanan bergizi seimbang, berpikir kritis terhadap informasi sederhana, serta menjaga kebersihan lingkungan sebagai bagian dari perilaku hidup sehat.</p>
                <p>Sebagai upaya meningkatkan pengetahuan siswa mengenai kesehatan dan lingkungan, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan menyelenggarakan <em>kegiatan edukasi di SDN 2 Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan</em> pada <em>15 Juli 2026.</em> Kegiatan ini diikuti oleh <strong>seluruh siswa kelas I hingga kelas VI</strong> dan dilaksanakan dalam dua sesi, yaitu sesi pertama untuk kelas I–III sebelum waktu istirahat, serta sesi kedua untuk kelas IV–VI setelah waktu istirahat sehingga penyampaian materi dapat disesuaikan dengan karakteristik setiap kelompok usia.</p>
                <p>Kegiatan diawali dengan pemutaran video ice breaking bertema <strong>"Isi Piringku"</strong> yang bertujuan menarik perhatian siswa sekaligus mengenalkan pentingnya mengonsumsi makanan bergizi seimbang. Suasana kelas menjadi lebih hidup karena siswa diajak bernyanyi dan mengikuti isi video sebelum memasuki penyampaian materi utama.</p>
                <p>Selanjutnya, mahasiswa KKN menyampaikan materi mengenai <strong>Pedoman Gizi Seimbang melalui konsep "Isi Piringku"</strong> yang mengacu pada pedoman dari Kementerian Kesehatan Republik Indonesia. Siswa dikenalkan dengan komposisi satu piring makan yang ideal, yang terdiri atas makanan pokok, lauk pauk sebagai sumber protein, sayur, dan buah dengan porsi yang seimbang. Selain itu, dijelaskan pula pentingnya membatasi konsumsi makanan dan minuman tinggi gula, garam, dan lemak sebagai bagian dari penerapan pola makan sehat.</p>
                <p>Untuk memperkuat pemahaman siswa, kegiatan dilanjutkan dengan <strong>permainan interaktif penerapan "Isi Piringku".</strong> Siswa dibagi ke dalam beberapa kelompok dan masing-masing kelompok memperoleh lembar bergambar piring serta stiker berbagai jenis makanan dan minuman. Mereka kemudian diminta menempelkan gambar makanan yang sesuai dengan komposisi "Isi Piringku" sekaligus membedakan makanan yang baik untuk dikonsumsi sehari-hari dengan makanan atau minuman yang sebaiknya dibatasi. Melalui permainan ini, siswa belajar mengenali pilihan makanan sehat dengan cara yang menyenangkan dan melatih kerja sama antarteman.</p>
                <p>Setelah sesi gizi seimbang, kegiatan dilanjutkan dengan <strong>materi "Detektif Data Buah",</strong> yaitu pengenalan konsep statistika dasar yang dikemas dalam bentuk permainan interaktif. Siswa diajak <strong>mengamati, menghitung, mengelompokkan, dan menyajikan data sederhana berdasarkan jenis buah.</strong> Melalui aktivitas tersebut, siswa tidak hanya belajar mengenal berbagai jenis buah, tetapi juga memperoleh pengalaman belajar berhitung dan membaca data secara sederhana sesuai dengan tingkat pendidikan sekolah dasar.</p>
                <p>Rangkian kegiatan kemudian ditutup dengan edukasi mengenai <strong>filtrasi air bersih.</strong> Mahasiswa KKN menyampaikan materi mengenai <strong>pentingnya air bersih</strong> bagi kesehatan serta menjelaskan proses penyaringan air. Sebagai pelengkap materi, dilakukan <strong>demonstrasi pembuatan alat filtrasi air sederhana</strong> menggunakan bahan-bahan yang mudah diperoleh di lingkungan sekitar. Demonstrasi ini bertujuan memberikan gambaran kepada siswa mengenai cara kerja penyaringan air sekaligus menumbuhkan kesadaran akan pentingnya menjaga kualitas air yang digunakan dalam kehidupan sehari-hari.</p>
                <p>Seluruh rangkaian kegiatan berlangsung dengan antusias. Para siswa aktif menjawab pertanyaan, mengikuti permainan, serta memperhatikan setiap demonstrasi yang diberikan. Melalui pendekatan yang interaktif dan menyenangkan, materi kesehatan dan lingkungan dapat diterima dengan baik oleh siswa.</p>
                <p>Melalui kegiatan ini, Tim KKN-PPM UGM Unit Tilik Tulakan berharap siswa SDN 2 Wonoanti semakin memahami pentingnya menerapkan pola makan bergizi seimbang, memiliki kemampuan berpikir kritis melalui pengolahan data sederhana, serta memiliki kepedulian terhadap pentingnya penggunaan air bersih dalam kehidupan sehari-hari. Pengetahuan yang diperoleh diharapkan dapat diterapkan di rumah bersama keluarga sehingga mampu mendukung terbentuknya generasi yang sehat, cerdas, dan peduli lingkungan.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_lilin: {
            tag: 'Kegiatan Proker',
            title: 'Program CAHAYA: Lilin Aromaterapi Minyak Jelantah',
            image: 'assets/images/proker_lilin1.jpg',
            desc: `
                <p>Minyak jelantah merupakan limbah rumah tangga yang hampir setiap hari dihasilkan dari aktivitas memasak. Apabila dibuang secara sembarangan, minyak jelantah dapat mencemari lingkungan, menyumbat saluran air, serta berpotensi menimbulkan dampak negatif bagi kesehatan apabila digunakan kembali secara berulang. Padahal, di balik limbah tersebut terdapat potensi yang dapat dikembangkan menjadi produk kreatif dan bernilai ekonomi. Berangkat dari kondisi tersebut, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode II Tahun 2026 Subunit Wonoanti menyelenggarakan Program CAHAYA (Ciptakan Hasil dari Jelantah yang Bernilai dan Berdaya) melalui pelatihan pembuatan lilin aromaterapi berbahan dasar minyak jelantah yang dipadukan dengan edukasi pengemasan produk untuk meningkatkan nilai jual.</p>
                <p>Kegiatan ini dilaksanakan pada Minggu, 12 Juli 2026, bertempat di Dusun Duren, Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan, bersamaan dengan agenda rapat rutin PKK Dusun Duren. Pelaksanaan kegiatan dapat terlaksana berkat dukungan dan fasilitasi dari Kepala Dusun Duren, Ibu Sringatin, yang memberikan kesempatan kepada mahasiswa KKN untuk mengisi materi dalam pertemuan rutin PKK. Kesempatan tersebut dimanfaatkan untuk berbagi pengetahuan sekaligus mendorong lahirnya ide usaha kreatif yang dapat dikembangkan oleh ibu-ibu PKK sebagai sumber penghasilan tambahan.</p>
                <p>Pada sesi pertama, mahasiswa KKN memperkenalkan pemanfaatan minyak jelantah sebagai bahan baku pembuatan lilin aromaterapi. Peserta diberikan pemahaman bahwa minyak jelantah yang selama ini dianggap sebagai limbah rumah tangga ternyata masih dapat diolah menjadi produk yang memiliki manfaat dan nilai ekonomi. Selain menjelaskan dampak negatif pembuangan minyak jelantah secara sembarangan, mahasiswa juga memaparkan tahapan pengolahan minyak jelantah menjadi lilin aromaterapi, mulai dari proses penyaringan minyak, pencampuran bahan, hingga penambahan pewangi agar menghasilkan lilin yang menarik dan nyaman digunakan. Selama sesi berlangsung, ibu-ibu PKK tampak antusias mengikuti penjelasan dan aktif berdiskusi mengenai peluang pemanfaatan minyak jelantah yang selama ini belum banyak dimanfaatkan.</p>
                <div style="text-align: center; margin: 1.5rem 0;">
                    <img src="assets/images/proker_lilin2.jpg" alt="Proses Pembuatan Lilin Aromaterapi" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: inline-block;">
                    <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Mahasiswa KKN mempraktikkan langsung proses pelelehan lilin minyak jelantah menggunakan kompor portabel bersama Ibu-Ibu PKK Dusun Duren.</p>
                </div>
                <p>Setelah penyampaian materi mengenai pembuatan lilin, kegiatan dilanjutkan dengan edukasi mengenai pengemasan produk sebagai strategi untuk meningkatkan nilai jual. Mahasiswa menjelaskan bahwa kualitas produk yang baik perlu didukung oleh kemasan yang menarik agar mampu meningkatkan minat konsumen. Berbagai contoh desain kemasan sederhana diperkenalkan kepada peserta, mulai dari penggunaan kotak kemasan, label produk, hingga penambahan identitas merek yang dapat memberikan kesan lebih profesional. Selain berfungsi sebagai pelindung produk, kemasan juga menjadi salah satu faktor penting dalam membangun daya tarik dan kepercayaan calon pembeli.</p>
                <p>Dalam sesi ini, peserta juga diajak berdiskusi mengenai berbagai peluang pemasaran lilin aromaterapi. Produk tersebut tidak hanya dapat digunakan sebagai pengharum ruangan, tetapi juga memiliki potensi untuk dipasarkan sebagai suvenir pernikahan, hampers, hadiah, maupun produk kerajinan lokal yang dapat dijual melalui bazar desa ataupun media sosial. Dengan biaya produksi yang relatif rendah dan memanfaatkan bahan baku yang tersedia di rumah, usaha lilin aromaterapi diharapkan dapat menjadi salah satu alternatif sumber pendapatan tambahan bagi keluarga.</p>
                <p>Kegiatan berlangsung dengan suasana yang hangat dan interaktif. Ibu-ibu PKK menunjukkan ketertarikan terhadap inovasi yang diperkenalkan serta memberikan berbagai tanggapan mengenai kemungkinan penerapan usaha tersebut di lingkungan Dusun Duren. Diskusi yang terjalin tidak hanya membahas proses pembuatan produk, tetapi juga peluang pemasaran, strategi penentuan harga, hingga pentingnya menjaga kualitas produk agar mampu bersaing di pasaran.</p>
                <p>Melalui Program CAHAYA, Tim KKN-PPM UGM Tilik Tulakan berharap masyarakat, khususnya ibu-ibu PKK Dusun Duren, dapat melihat minyak jelantah bukan lagi sebagai limbah yang harus dibuang, melainkan sebagai sumber daya yang dapat diolah menjadi produk kreatif bernilai ekonomis. Dengan memadukan inovasi pengolahan limbah dan strategi pengemasan produk, kegiatan ini diharapkan mampu mendorong tumbuhnya usaha rumah tangga yang berkelanjutan, meningkatkan nilai tambah produk lokal, serta memberikan kontribusi terhadap pemberdayaan ekonomi masyarakat dan pelestarian lingkungan di Desa Wonoanti.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_qris: {
            tag: 'Kegiatan Proker',
            title: 'Digitalisasi UMKM: Edukasi QRIS Pembayaran Digital',
            image: 'assets/images/proker_qris3.jpg',
            desc: `
                <p>Perkembangan teknologi digital telah membawa perubahan besar dalam sistem pembayaran masyarakat, termasuk melalui penggunaan Quick Response Code Indonesian Standard (QRIS) yang semakin banyak dimanfaatkan dalam transaksi sehari-hari. Meski demikian, masih terdapat pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di pedesaan yang belum memahami manfaat maupun tata cara penggunaan sistem pembayaran digital tersebut. Berangkat dari kondisi tersebut, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode II Tahun 2026 Subunit Wonoanti melaksanakan program edukasi bertajuk Digitalisasi UMKM yang mengintegrasikan materi mengenai pemanfaatan QRIS, promosi pembayaran cashless, serta keamanan transaksi digital bagi pelaku UMKM.</p>
                <p>Kegiatan dilaksanakan pada Selasa, 30 Juni 2026, dengan metode door to door di berbagai warung dan usaha milik masyarakat di Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan. Pendekatan ini dipilih agar mahasiswa dapat berdialog secara langsung dengan para pelaku usaha, memahami kondisi usaha masing-masing, serta menyampaikan materi edukasi secara lebih personal dan mudah dipahami.</p>
                <p>Sebelum memberikan edukasi, mahasiswa terlebih dahulu melakukan observasi sederhana untuk mengidentifikasi toko atau UMKM yang memiliki potensi dalam menerapkan sistem pembayaran digital. Pertimbangan tersebut didasarkan pada jenis usaha, jumlah pelanggan, serta aktivitas transaksi yang dilakukan setiap harinya. Setelah itu, mahasiswa memperkenalkan konsep pembayaran digital menggunakan QRIS sebagai salah satu alternatif metode pembayaran yang praktis, cepat, dan aman bagi penjual maupun pembeli.</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 1.5rem 0;">
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/proker_qris1.jpg" alt="Edukasi QRIS UMKM" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Pendampingan literasi keuangan digital door-to-door bersama pemilik toko kelontong Wonoanti.</p>
                    </div>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/proker_qris2.jpg" alt="Edukasi QRIS di Toko Pakaian" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Mahasiswa KKN menyerahkan leaflet panduan pembuatan QRIS kepada pemilik usaha pakaian di Desa Wonoanti.</p>
                    </div>
                </div>

                <p>Dalam kegiatan ini, mahasiswa menjelaskan bahwa QRIS merupakan standar kode QR nasional yang memungkinkan konsumen melakukan pembayaran melalui berbagai aplikasi pembayaran digital tanpa perlu menggunakan kode QR yang berbeda-beda. Selain memberikan kemudahan dalam proses transaksi, penggunaan QRIS juga dinilai mampu meningkatkan kenyamanan pelanggan karena menyediakan pilihan pembayaran selain uang tunai (cashless). Untuk mendukung pemahaman tersebut, mahasiswa turut memperkenalkan contoh media promosi sederhana, seperti stiker atau informasi penerimaan pembayaran QRIS yang dapat dipasang di area kasir agar lebih mudah diketahui oleh pelanggan.</p>
                <p>Selain pengenalan QRIS, pelaku UMKM juga memperoleh edukasi mengenai pentingnya menjaga keamanan transaksi digital. Materi yang disampaikan meliputi cara mengenali transaksi yang sah, pentingnya menjaga kerahasiaan data pribadi dan akun pembayaran, serta meningkatkan kewaspadaan terhadap berbagai bentuk penipuan digital yang mengatasnamakan layanan pembayaran. Edukasi ini bertujuan agar para pelaku usaha tidak hanya memahami manfaat penggunaan QRIS, tetapi juga mampu menggunakan layanan pembayaran digital secara aman dan bijaksana.</p>
                <p>Melalui pendekatan door to door, kegiatan berlangsung secara komunikatif karena setiap pelaku usaha memiliki kesempatan untuk menyampaikan pengalaman, kendala, maupun pertanyaan terkait pembayaran digital. Sebagian pelaku UMKM mengaku masih mengandalkan transaksi tunai karena belum memahami sistem pembayaran digital, sementara sebagian lainnya menunjukkan ketertarikan untuk mulai mempelajari penggunaan QRIS sebagai salah satu alternatif metode pembayaran di usahanya.</p>
                <p>Melalui kegiatan edukasi ini, Tim KKN-PPM UGM Tilik Tulakan berharap semakin banyak pelaku UMKM di Desa Wonoanti yang mengenal manfaat digitalisasi pembayaran dan memiliki kesiapan untuk beradaptasi dengan perkembangan teknologi finansial. Peningkatan literasi digital diharapkan dapat menjadi langkah awal dalam mendukung daya saing UMKM desa, memperluas pilihan layanan pembayaran bagi pelanggan, serta mendorong pertumbuhan ekonomi masyarakat yang lebih inklusif di era digital.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_ecoprint: {
            tag: 'Kegiatan Proker',
            title: 'Pelatihan Ecoprint Kreatif & Kewirausahaan SD IT',
            image: 'assets/images/proker_ecoprint1.jpg',
            desc: `
                <p>Pemanfaatan potensi alam di sekitar lingkungan menjadi salah satu cara yang efektif untuk menanamkan kepedulian terhadap lingkungan sekaligus mengembangkan kreativitas anak sejak usia dini. Berangkat dari pemikiran tersebut, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode II Tahun 2026 Subunit Wonoanti melaksanakan Pelatihan Ecoprint di SD IT Al-Wakil Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan, pada Kamis, 16 Juli 2026. Kegiatan ini mengusung konsep pembelajaran yang memadukan edukasi lingkungan, pengenalan keanekaragaman hayati desa, serta penanaman jiwa kewirausahaan melalui pembuatan tote bag ecoprint berbahan alami.</p>
                <p>Kegiatan diawali dengan penyampaian materi mengenai ecoprint, yaitu teknik menghias kain menggunakan motif alami dari daun dan bunga dengan memanfaatkan pigmen yang terkandung di dalamnya. Berbeda dengan teknik pewarnaan pada umumnya, ecoprint tidak memerlukan pewarna sintetis sehingga lebih ramah lingkungan. Pada sesi ini, siswa juga diajak mengenal berbagai jenis daun yang tumbuh di sekitar sekolah dan lingkungan Desa Wonoanti. Mahasiswa KKN menjelaskan bahwa setiap daun memiliki bentuk, tekstur, dan kandungan pigmen yang berbeda sehingga mampu menghasilkan motif yang unik pada kain. Melalui pengenalan tersebut, siswa diharapkan semakin mengenal kekayaan hayati di lingkungan sekitar sekaligus memahami bahwa bahan-bahan sederhana yang sering dijumpai sehari-hari dapat diolah menjadi produk yang memiliki nilai seni dan nilai ekonomi.</p>
                <p>Setelah sesi pengenalan, kegiatan dilanjutkan dengan penjelasan mengenai alat dan bahan yang digunakan dalam praktik ecoprint. Mahasiswa memperkenalkan tote bag berbahan kain katun sebagai media utama, daun-daun segar yang telah dipilih, plastik sebagai pelapis, palu kayu untuk membantu proses perpindahan pigmen daun ke kain, serta beberapa perlengkapan pendukung lainnya. Sebelum praktik dimulai, siswa diberikan arahan mengenai cara memilih daun yang baik, menyusun komposisi motif agar terlihat menarik, serta teknik memukul daun dengan benar agar warna dan bentuknya dapat tercetak secara maksimal tanpa merusak kain.</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 1.5rem 0;">
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/proker_ecoprint3.jpg" alt="Foto Bersama Produk Tote Bag Ecoprint" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Foto bersama mahasiswa KKN UGM dan seluruh peserta pelatihan menunjukkan hasil karya tote bag ecoprint.</p>
                    </div>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/proker_ecoprint2.jpg" alt="Siswa Memukul Daun Ecoprint" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Siswa-siswi SD IT Al-Wakil antusias memukul daun-daunan menggunakan palu kayu di atas media kain.</p>
                    </div>
                </div>

                <p>Memasuki sesi praktik, setiap siswa diberi kesempatan untuk menuangkan kreativitasnya secara langsung. Daun-daun yang telah dipilih disusun di atas permukaan tote bag sesuai dengan pola yang diinginkan, kemudian ditutup menggunakan plastik sebelum dipukul perlahan menggunakan palu kayu. Suasana kelas pun berlangsung sangat meriah. Para siswa tampak antusias mencoba berbagai bentuk susunan daun dan tidak sedikit yang saling berdiskusi mengenai kombinasi motif yang akan dibuat. Setelah proses pemukulan selesai, daun dilepas secara perlahan sehingga tampak motif alami dengan warna dan bentuk yang berbeda-beda pada setiap tote bag. Hasil karya yang dihasilkan menunjukkan bahwa setiap anak memiliki kreativitas dan imajinasi yang unik.</p>
                <p>Selain memberikan pengalaman baru dalam bidang seni, pelatihan ini juga menjadi sarana edukasi mengenai pentingnya menjaga kelestarian lingkungan melalui pemanfaatan sumber daya alam secara bijaksana. Mahasiswa KKN menjelaskan bahwa daun yang biasanya hanya dianggap sebagai sampah organik ternyata dapat dimanfaatkan menjadi produk kerajinan yang menarik dan bernilai jual. Melalui tote bag ecoprint, siswa dikenalkan pada konsep green entrepreneurship, yaitu menghasilkan produk kreatif yang ramah lingkungan sekaligus memiliki peluang ekonomi. Dengan demikian, anak-anak tidak hanya belajar membuat kerajinan, tetapi juga mulai memahami bahwa kreativitas dapat menjadi bekal untuk menciptakan peluang usaha di masa depan.</p>
                <p>Selama kegiatan berlangsung, antusiasme siswa terlihat dari keaktifan mereka dalam bertanya, mencoba berbagai variasi motif, hingga saling menunjukkan hasil karya kepada teman-temannya. Pendekatan belajar melalui praktik langsung membuat materi lebih mudah dipahami sekaligus memberikan pengalaman yang menyenangkan. Kegiatan ini juga menjadi wadah bagi siswa untuk mengenal potensi alam di sekitar mereka dengan cara yang sederhana namun bermakna.</p>
                <p>Melalui pelatihan ecoprint ini, Tim KKN-PPM UGM Tilik Tulakan berharap siswa SD IT Al-Wakil Wonoanti semakin peduli terhadap lingkungan, mampu memanfaatkan potensi alam di sekitarnya secara kreatif, serta memiliki keberanian untuk mengembangkan ide-ide inovatif yang bernilai ekonomis. Harapannya, keterampilan sederhana yang diperoleh dalam kegiatan ini dapat menjadi langkah awal dalam membentuk generasi muda yang kreatif, cinta lingkungan, dan memiliki jiwa wirausaha sejak dini.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_kelor: {
            tag: 'Kegiatan Proker',
            title: 'Pencegahan Stunting Melalui Olahan Puding Kelor PKK',
            image: 'assets/images/proker_kelor1.jpg',
            desc: `
                <p>Stunting masih menjadi salah satu permasalahan kesehatan yang memerlukan perhatian bersama karena dapat memengaruhi pertumbuhan fisik, perkembangan otak, hingga kualitas hidup anak di masa depan. Selain pemenuhan gizi seimbang, <em>pemanfaatan bahan pangan lokal yang mudah dijumpai di lingkungan sekitar</em> juga menjadi salah satu langkah yang dapat dilakukan untuk <em>mendukung upaya pencegahan stunting.</em> Salah satu tanaman yang memiliki kandungan gizi tinggi adalah <em>daun kelor,</em> yang kaya akan protein, vitamin, mineral, dan antioksidan sehingga berpotensi menjadi sumber pangan bergizi bagi keluarga.</p>
                <p>Berangkat dari kondisi tersebut, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode II Tahun 2026 Subunit Wonoanti menyelenggarakan <strong>Program Gerakan Gizi Seimbang untuk Anak Sehat dan Bebas Stunting</strong> yang memanfaatkan daun kelor sebagai pangan lokal bergizi. Kegiatan ini dilaksanakan pada <strong>Senin, 20 Juli 2026,</strong> bertempat di Sasono Mulyo, Dusun Krajan, Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan, dan diikuti oleh <strong>ibu-ibu PKK Dusun Krajan.</strong></p>
                <p>Pada sesi awal, kami menyampaikan materi mengenai stunting, mulai dari pengertian, penyebab, dampak jangka panjang, hingga pentingnya pencegahan sejak dini. Materi juga dilengkapi dengan pemaparan kondisi stunting di Desa Wonoanti berdasarkan hasil wawancara bersama <em>Kader Posyandu Desa Wonoanti.</em> Penyampaian data tersebut diharapkan dapat memberikan gambaran nyata mengenai kondisi di lingkungan sekitar sekaligus meningkatkan kesadaran masyarakat bahwa pencegahan stunting memerlukan keterlibatan berbagai pihak, termasuk keluarga.</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 1.5rem 0;">
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/proker_kelor2.png" alt="Proses Blender Daun Kelor" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Mahasiswa KKN mempersiapkan dan melumatkan daun kelor segar menggunakan blender untuk adonan puding.</p>
                    </div>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/proker_kelor3.jpg" alt="Foto Bersama Ibu PKK Dusun Krajan" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Foto bersama KKN UGM dan seluruh peserta rapat PKK Dusun Krajan di depan Balai Sasono Mulyo.</p>
                    </div>
                </div>

                <p>Setelah itu, dilanjutkan pada <em>potensi daun kelor</em> sebagai salah satu bahan pangan lokal yang mudah diperoleh dan memiliki kandungan gizi tinggi. Kami menjelaskan berbagai manfaat daun kelor dalam membantu memenuhi kebutuhan nutrisi keluarga serta pentingnya mengolah bahan pangan lokal menjadi menu yang menarik agar lebih mudah diterima, terutama oleh anak-anak.</p>
                <p>Sebagai bentuk penerapan materi, kegiatan dilanjutkan dengan demonstrasi pembuatan puding daun kelor. Peserta diperlihatkan secara langsung tahapan pembuatannya, mulai dari persiapan bahan, proses pengolahan daun kelor, hingga penyajian puding yang siap dikonsumsi. Demonstrasi ini memberikan gambaran bahwa daun kelor tidak hanya dapat dimasak sebagai sayuran, tetapi juga dapat diolah menjadi camilan sehat dengan cita rasa yang lebih disukai oleh anak. Usai demonstrasi, puding kelor dibagikan kepada seluruh peserta untuk dicicipi.</p>
                <p>Melalui kegiatan ini, kami berharap pemanfaatan daun kelor tidak hanya berhenti sebagai pengetahuan, tetapi dapat diterapkan dalam kehidupan sehari-hari sebagai bagian dari upaya pemenuhan gizi keluarga. Dengan mengoptimalkan potensi pangan lokal yang tersedia di sekitar, masyarakat diharapkan semakin terdorong untuk berperan aktif dalam pencegahan stunting sekaligus mendukung terwujudnya generasi yang lebih sehat, tumbuh optimal, dan berkualitas.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_biogal: {
            tag: 'Kegiatan Proker',
            title: 'BIOCYCLE & BIOGAL: Komposter Galon Bekas Skala Rumah Tangga',
            image: 'assets/images/proker_biogal.jpg',
            desc: `
                <p>Permasalahan sampah rumah tangga, khususnya limbah organik sisa dapur seperti potongan sayuran, kulit buah, dan sisa makanan, seringkali menjadi tantangan di lingkungan masyarakat. Jika dibiarkan menumpuk, limbah organik tidak hanya menimbulkan bau tidak sedap dan mengundang vektor penyakit, tetapi juga berpotensi mencemari lingkungan. Mengubah sampah organik menjadi kompos adalah solusi yang sangat efektif. Namun, keterbatasan lahan atau ketiadaan wadah pengomposan sering menjadi kendala. Oleh karena itu, program BIOCYCLE hadir membawa inovasi BIOGAL (Bio Komposter Galon) sebagai solusi praktis skala rumah tangga untuk mengolah limbah organik menjadi pupuk padat (kompos) sekaligus memanen air lindi sebagai Pupuk Organik Cair (POC).</p>
                <p>Sebagai bentuk dukungan terhadap upaya pemberdayaan masyarakat dan pelestarian lingkungan, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode 2 Tahun 2026 Tim KKN-PPM UGM Sub Unit Wonoanti menyelenggarakan kegiatan sosialisasi dan pelatihan ini di Dusun Bulih. Kegiatan yang dilaksanakan pada tanggal 25 Juli 2026 di Dusun Bulih, Desa Wonoanti, Kabupaten Pacitan, Jawa Timur ini diawali dengan edukasi pemilahan sampah dari rumah dan dilanjutkan dengan praktik pembuatan serta penggunaan alat. Kegiatan ini diikuti oleh warga setempat dengan penuh semangat dan antusiasme yang sangat seru, karena inovasi ini dinilai sangat murah, mudah, dan aplikatif untuk langsung diterapkan di dapur masing-masing.</p>
                <p>Sistem pengomposan BIOCYCLE ini diimplementasikan melalui alat BIOGAL yang dirancang secara sederhana menggunakan barang bekas, yaitu galon air mineral yang modifikasi. Wadah galon tersebut dilubangi pada bagian bawah untuk dipasangi keran dispenser yang berfungsi sebagai saluran pengeluaran pupuk cair (air lindi). Di dalam bagian dasar galon, diberikan sekat berpori atau saringan pemisah. Fungsinya adalah untuk menahan sampah padat organik agar tidak menyumbat keran, sekaligus memberikan ruang bagi cairan lindi hasil dekomposisi untuk menetes dan terakumulasi di dasar wadah. Modifikasi ini memastikan proses pengomposan berjalan optimal dan mencegah sampah terendam air secara berlebihan yang dapat memicu bau busuk.</p>
                <p>Tahapan pengolahan sampah menggunakan BIOGAL sangat mudah untuk dilakukan secara mandiri setiap hari. Warga diedukasi untuk mencacah atau memotong sampah organik rumah tangga agar ukurannya menjadi lebih kecil guna mempercepat proses penguraian oleh mikroorganisme. Sampah yang telah dicacah kemudian dimasukkan ke dalam galon dan disemprot dengan larutan bioaktivator (seperti EM4 yang dilarutkan dengan air dan molase). Setelah itu, galon ditutup rapat untuk menjaga kelembapan dan memfasilitasi proses fermentasi. Warga dapat terus menambahkan limbah organik harian ke dalam komposter ini secara berlapis dengan mengulang perlakuan yang sama.</p>
                <p>Keunggulan utama dari inovasi BIOCYCLE dengan pemanfaatan BIOGAL ini adalah kemampuannya menghasilkan dua jenis pupuk secara bersamaan. Dalam kegiatan ini, edukasi mengenai pemanfaatan air lindi menjadi salah satu fokus utama yang sangat menarik perhatian warga. Setelah sekitar 2 hingga 3 minggu proses fermentasi, cairan lindi yang terakumulasi di bagian bawah dapat dipanen melalui keran. Air lindi ini merupakan Pupuk Organik Cair (POC) yang sangat kaya akan unsur hara makro, mikro, dan mikroorganisme baik. Warga diberikan edukasi intensif bahwa cairan lindi ini sangat pekat, sehingga penggunaannya wajib diencerkan terlebih dahulu dengan air bersih (misalnya dengan rasio 1:10) sebelum disiramkan ke area perakaran. Pengenceran ini sangat penting untuk merangsang pertumbuhan vegetatif dan generatif tanaman secara optimal, serta mencegah akar tanaman menjadi layu atau "kepanasan" akibat konsentrasi nutrisi yang terlalu tinggi.</p>
                <p>Sementara itu, setelah beberapa waktu, sampah padat di dalam galon akan menyusut, terurai sempurna, berwarna kehitaman, dan tidak berbau, yang menandakan bahwa kompos padat siap dipanen dan digunakan sebagai media tanam penyubur tanah. Melalui kegiatan pelatihan yang interaktif ini, diharapkan warga Dusun Bulih dapat secara mandiri mengelola limbah domestiknya. Ke depan, penerapan program BIOCYCLE dan penggunaan BIOGAL secara berkelanjutan diharapkan mampu menciptakan lingkungan desa yang lebih bersih, sehat, serta mendukung penyediaan pupuk organik mandiri untuk memaksimalkan potensi pekarangan dan ketahanan pangan keluarga di Desa Wonoanti.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_mmb: {
            tag: 'Kegiatan Proker',
            title: 'Pembuatan MMB & Data Penyakit Ruminansia',
            image: 'assets/images/proker_mmb.jpg',
            desc: `
                <p>Mahasiswa KKN-PPM UGM Tim Tilik Tulakan Periode 2 Tahun 2026 melaksanakan kegiatan sosialisasi kesehatan ternak dan pemberdayaan peternak di Desa Wonoanti pada Sabtu, 25 Juli 2026. Kegiatan ini menjadi salah satu program kerja interdisipliner yang mengintegrasikan keilmuan Kedoketran Hewan, Peternakan, Statistika, dan Manajemen untuk menjawab kebutuhan masyarakat, khususnya para peternak ruminansia di Desa Wonoanti.</p>
                <p>Salah satu fokus utama kegiatan adalah <strong>sosialisasi dan pembuatan Molasses Mineral Block (MMB)</strong> sebagai suplemen pakan ternak. Kegiatan ini merupakan hasil kolaborasi antara mahasiswa Program Studi Kedokteran Hewan dan Program Studi Peternakan. Melalui sesi praktik, peserta tidak hanya memperoleh pengetahuan mengenai manfaat MMB bagi kesehatan dan produktivitas ternak, tetapi juga menyaksikan secara langsung proses pembuatannya menggunakan bahan-bahan yang mudah diperoleh.</p>
                <p>Molasses Mineral Block merupakan pakan tambahan yang mengandung molases, mineral, serta nutrien penting yang dapat membantu memenuhi kebutuhan gizi ternak ruminansia. Pemberian MMB secara tepat diharapkan mampu meningkatkan konsumsi pakan, memperbaiki kondisi tubuh ternak, serta mendukung produktivitas dan daya tahan ternak terhadap berbagai gangguan kesehatan.</p>
                <p>Sebagai bentuk dukungan terhadap penerapan ilmu yang telah diberikan, setiap peserta yang hadir memperoleh Molasses Mineral Block untuk digunakan pada ternak mereka. Pembagian MMB ini diharapkan dapat menjadi langkah awal bagi peternak untuk mengenal dan menerapkan teknologi pakan sederhana yang mampu meningkatkan kualitas pemeliharaan ternak secara berkelanjutan.</p>
                <p>Selain membahas aspek teknis pembuatan MMB, kegiatan juga dilanjutkan dengan sosialisasi mengenai peluang usaha Molasses Mineral Block yang disampaikan oleh mahasiswa Program Studi Manajemen. Dalam sesi ini, peserta diajak melihat potensi MMB tidak hanya sebagai inovasi di bidang peternakan, tetapi juga sebagai produk yang memiliki nilai ekonomi dan dapat dikembangkan menjadi peluang usaha baru di tingkat desa. Materi yang disampaikan meliputi potensi pasar, strategi pemasaran sederhana, hingga perhitungan dasar biaya produksi dan keuntungan.</p>
                <p>Program ini juga mencakup sosialisasi mengenai berbagai penyakit pada ternak ruminansia yang umum ditemukan di Kabupaten Pacitan. Materi disusun berdasarkan data yang diperoleh dari Dinas Ketahanan Pangan dan Pertanian Kabupaten Pacitan sehingga informasi yang diberikan sesuai dengan kondisi dan tantangan yang dihadapi peternak di wilayah tersebut. Penyampaian materi difokuskan pada upaya meningkatkan kewaspadaan peternak terhadap penyakit yang berpotensi menurunkan produktivitas ternak.</p>
                <p>Kegiatan sosialisasi penyakit ruminansia merupakan program interdisipliner antara Program Studi Kedokteran Hewan dan Program Studi Statistika. Mahasiswa Kedokteran Hewan berperan dalam menjelaskan karakteristik penyakit, faktor risiko, gejala klinis, serta langkah-langkah pencegahannya. Sementara itu, mahasiswa Statistika berkontribusi dalam mengolah dan menyajikan data penyakit menjadi informasi yang mudah dipahami oleh masyarakat sehingga penyampaian materi menjadi lebih berbasis data.</p>
                <p>Melalui pendekatan berbasis data tersebut, peserta memperoleh gambaran mengenai tren kejadian penyakit ruminansia di Kabupaten Pacitan serta pentingnya penerapan manajemen kesehatan ternak. Edukasi ini diharapkan mampu meningkatkan kesadaran peternak untuk melakukan tindakan pencegahan sejak dini melalui perbaikan sanitasi kandang, pemberian pakan yang berkualitas, serta konsultasi dengan tenaga kesehatan hewan apabila ditemukan gejala penyakit.</p>
                <p>Antusiasme masyarakat terlihat dari tingginya partisipasi peserta selama kegiatan berlangsung. Diskusi interaktif yang terjadi menunjukkan besarnya perhatian peternak terhadap upaya peningkatan kesehatan ternak sekaligus peluang pengembangan usaha berbasis peternakan. Berbagai pertanyaan mengenai penggunaan MMB, pencegahan penyakit, hingga peluang pemasaran produk menjadi bukti bahwa materi yang disampaikan relevan dengan kebutuhan masyarakat.</p>
                <p>Melalui kolaborasi lintas disiplin ilmu, KKN-PPM UGM Tim Tilik Tulakan Periode 2 Tahun 2026 berupaya menghadirkan solusi yang tidak hanya bersifat edukatif, tetapi juga aplikatif dan berkelanjutan. Sinergi antara Kedokteran Hewan, Peternakan, Statistika, dan Manajemen diharapkan mampu memberikan manfaat nyata bagi masyarakat Desa Wonoanti dalam meningkatkan kesehatan ternak, produktivitas usaha peternakan, serta membuka peluang ekonomi baru melalui pengembangan Molasses Mineral Block.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_gamau: {
            tag: 'Kegiatan Proker',
            title: 'Sosialisasi & Praktik Budidaya Rumput Gama Umami',
            image: 'assets/images/proker_gamau.jpg',
            desc: `
                <p>Ketersediaan hijauan pakan berkualitas tinggi menjadi salah satu langkah penting dalam menjaga keberlanjutan bisnis peternakan ruminansia. Melalui pemanfaatan inovasi pakan unggul, peternak dapat lebih mudah memenuhi kebutuhan energi, protein, dan mineral ternak, serta menyediakan serat kasar untuk mendukung metabolisme rumen secara optimal.</p>
                <p>Sebagai upaya meningkatkan pengetahuan dan keterampilan peternak, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan menyelenggarakan kegiatan sosialisasi dan praktik penanaran rumput Gama Umami di Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan pada 2 Juli 2026. Kegiatan ini diikuti oleh seluruh peternak di Dusun Ngunut dan Dusun Krajan agar penyampaian materi serta praktik budidaya dapat diterapkan secara langsung di lahan pakan masyarakat.</p>
                <p>Kegiatan diawali dengan pemaparan materi mengenai sejarah dan keunggulan rumput Gama Umami. Rumput ini merupakan hasil inovasi pemuliaan fisik rumput gajah dari Guru Besar Fakultas Peternakan UGM, <strong>Prof. Ir. Nafiatul Umami, S.Pt., MP., Ph.D., IPU., ASEAN Eng.</strong>, bersama Badan Tenaga Nuklir Nasional melalui teknologi radiasi sinar gamma dosis 100 Gray yang terbukti aman tanpa sisa radioaktif, serta telah terdaftar resmi di Kementerian Pertanian dengan nomor 889/PVHP/2020.</p>
                <p>Selanjutnya, mahasiswa KKN menyampaikan materi mengenai keunggulan morfologi dan nutrisi rumput Gama Umami. Rumput ini memiliki tinggi mencapai 3,4 hingga 3,7 meter, daun sepanjang 1,1 hingga 1,3 meter, diameter batang 2,2 hingga 2,9 sentimeter, serta mampu menghasilkan 41 hingga 50 tunas per rumpun. Dari segi produktivitas, rumput ini menghasilkan biomassa segar sebesar 50 hingga 60 kilogram per meter persegi, jauh melampaui rumput gajah lokal. Kelebihan utamanya meliputi tekstur daun halus tanpa bulu kasar, batang renyah dan manis, kandungan protein kasar 10 hingga 14 persen, serta nilai kecernaan bahan kering yang tinggi mencapai 72,68 persen.</p>
                <p>Untuk memperkuat pemahaman, kegiatan dilanjutkan dengan praktik penanaman dan demonstrasi budidaya langsung di lapangan. Peternak diajak mengolah tanah sedalam 30 sentimeter, membuat bedengan, dan menanam bibit stek batang berdiameter 2 sentimeter dengan posisi miring 45 derajat atau ditidurkan mendatar. Penanaman dilakukan menggunakan jarak 0,5 dengan 1 meter atau 60 dengan 40 sentimeter yang ideal diterapkan pada awal musim hujan.</p>
                <p>Setelah sesi penanaman, kegiatan dilanjutkan dengan penjelasan teknik pemeliharaan dan siklus pemanenan. Pemeliharaan dilakukan melalui penyiraman, penggemburan tanah, dan pemupukan rutin. Panen pertama dilakukan saat tanaman berumur 12 minggu dengan menyisakan tinggi batang 10 sentimeter dari tanah guna merangsang regenerasi tunas, sedangkan panen berikutnya dapat dilakukan setiap 45 hingga 50 hari pada musim hujan atau 60 hari pada musim kemarau.</p>
                <p>Rangkaian kegiatan kemudian ditutup dengan edukasi mitigasi risiko dan sistem penyajian pakan. Mengingat batangnya yang renyah dan manis rentan terhadap injakan serta menarik hama seperti tikus dan belalang, peternak dianjurkan menerapkan sistem potong bawa untuk disajikan langsung di kandang.</p>
                <p>Seluruh rangkaian kegiatan berlangsung dengan antusias. Para peternak aktif bertanya, memperhatikan setiap tahap penanaman, serta berminat membudidayakan rumput unggul ini di lahan mereka.</p>
                <p>Melalui kegiatan ini, Tim KKN-PPM UGM Unit Tilik Tulakan berharap peternak di Dusun Ngunut dan Dusun Krajan Desa Wonoanti semakin memahami pentingnya penggunaan hijauan pakan berkualitas tinggi. Pengetahuan yang diperoleh diharapkan dapat diterapkan secara mandiri sehingga mampu mendukung terbentuknya sektor peternakan yang produktif, efisien, dan berkelanjutan.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        proker_kandang: {
            tag: 'Program Kerja',
            title: 'Pembuatan Kandang Ayam Kastari Lestari: Kandang Ramah Lingkungan dengan Menerapkan Konsep Integrasi Manajemen Lingkungan',
            image: 'assets/images/proker_kandang2.jpg',
            desc: `
                <p>Sektor peternakan unggas memiliki potensi besar dalam meningkatkan ketahanan pangan dan perekonomian masyarakat desa. Namun, pengelolaan kandang yang kurang baik sering kali menimbulkan berbagai permasalahan lingkungan, seperti penumpukan limbah, bau tidak sedap, pencemaran air, serta rendahnya efisiensi pemanfaatan sumber daya. Oleh karena itu, diperlukan penerapan sistem peternakan yang ramah lingkungan melalui konsep integrasi manajemen lingkungan agar kegiatan peternakan dapat berjalan secara produktif sekaligus berkelanjutan.</p>
                <p>Sebagai upaya mendukung pengembangan peternakan berkelanjutan pada tanggal 28 Juli 2026, Tim KKN-PPM Universitas Gadjah Mada Periode II Tahun 2026 Unit Tilik Tulakan melaksanakan program Pembuatan Kandang Ayam Kastari Lestari (Kandang Ramah Lingkungan dengan Menerapkan Konsep Integrasi Manajemen Lingkungan) di Desa Wonoanti, Kecamatan Tulakan, Kabupaten Pacitan. Program ini dilaksanakan bersama pemerintah desa dan masyarakat sebagai bentuk penguatan sarana peternakan yang tidak hanya berfungsi sebagai tempat pemeliharaan ayam, tetapi juga menjadi contoh penerapan kandang yang memperhatikan aspek kebersihan, kesehatan ternak, dan kelestarian lingkungan.</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 1.5rem 0;">
                    <div style="flex: 1; min-width: 250px; max-width: 320px; text-align: center;">
                        <img src="assets/images/proker_kandang1.jpg" alt="Mahasiswa KKN UGM di dalam Kandang Ayam Kastari" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Mahasiswa KKN UGM berfoto di dalam konstruksi Kandang Ayam Kastari.</p>
                    </div>
                    <div style="flex: 1; min-width: 250px; max-width: 320px; text-align: center;">
                        <img src="assets/images/proker_kandang3.jpg" alt="Proses Pengerjaan Kandang" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Gotong royong mahasiswa dan warga merakit ram kawat kandang.</p>
                    </div>
                </div>

                <p>Kegiatan diawali dengan proses perencanaan lokasi dan desain kandang berdasarkan kondisi lahan yang tersedia. Mahasiswa KKN bersama masyarakat melakukan survei lokasi untuk menentukan area yang memiliki sirkulasi udara baik, memperoleh pencahayaan matahari yang cukup, memiliki sistem drainase yang memadai, serta berada pada jarak aman dari permukiman warga. Tahap ini bertujuan untuk meminimalkan risiko genangan air, penyebaran penyakit, dan pencemaran lingkungan akibat aktivitas peternakan.</p>
                <p>Selanjutnya dilakukan pembangunan kandang menggunakan material yang mudah diperoleh di lingkungan sekitar, seperti rangka kayu, bambu, kawat ram, dan atap ringan yang mampu memberikan perlindungan terhadap panas maupun hujan. Kandang dirancang dengan sistem ventilasi terbuka sehingga pertukaran udara berlangsung optimal dan kelembapan kandang dapat terjaga. Selain itu, lantai kandang dibuat lebih tinggi dari permukaan tanah untuk mencegah kelembapan berlebih sekaligus mempermudah proses pembersihan kotoran.</p>
                <p>Sebagai implementasi konsep integrasi manajemen lingkungan, kandang dilengkapi dengan sistem pengelolaan limbah sederhana. Kotoran ayam dikumpulkan secara berkala untuk dimanfaatkan sebagai bahan baku pupuk organik yang dapat diaplikasikan pada lahan pertanian masyarakat. Sementara itu, sisa pakan dan limbah organik lainnya dipisahkan agar tidak menimbulkan bau maupun mengundang hama. Pendekatan ini diharapkan mampu mengurangi pencemaran lingkungan sekaligus meningkatkan nilai ekonomi dari limbah peternakan.</p>
                <p>Setelah pembangunan selesai, mahasiswa KKN memberikan edukasi kepada masyarakat mengenai tata cara pemeliharaan kandang yang baik. Materi yang disampaikan meliputi pentingnya menjaga kebersihan kandang, pengaturan kepadatan ayam, penyediaan pakan and air minum yang higienis, pengendalian hama dan penyakit, serta jadwal pembersihan kandang secara rutin. Masyarakat juga diberikan pemahaman mengenai pentingnya biosekuriti sederhana, seperti membatasi akses keluar masuk kandang dan melakukan sanitasi peralatan peternakan secara berkala.</p>
                <p>Untuk mendukung keberlanjutan program, dilakukan pula pendampingan mengenai pemanfaatan hasil samping peternakan sebagai bagian dari ekonomi sirkular desa. Kotoran ayam yang telah diolah menjadi pupuk organik diharapkan dapat dimanfaatkan untuk meningkatkan produktivitas tanaman pangan, tanaman hortikultura, maupun tanaman obat keluarga di Desa Wonoanti sehingga tercipta hubungan yang saling mendukung antara sektor peternakan dan pertanian.</p>
                <p>Seluruh rangkaian kegiatan berlangsung dengan baik berkat partisipasi aktif masyarakat. Warga bersama mahasiswa bergotong royong dalam proses pembangunan kandang, mulai dari persiapan material, perakitan konstruksi, hingga penataan lingkungan sekitar kandang. Antusiasme masyarakat menunjukkan adanya kesadaran yang semakin meningkat mengenai pentingnya pengelolaan peternakan yang ramah lingkungan dan berorientasi pada keberlanjutan.</p>
                <p>Melalui program Pembuatan Kandang Ayam Kastari Lestari, Tim KKN-PPM UGM Unit Tilik Tulakan berharap masyarakat Desa Wonoanti dapat menerapkan sistem peternakan yang lebih sehat, bersih, dan efisien. Penerapan konsep integrasi manajemen lingkungan diharapkan mampu meningkatkan produktivitas peternakan, mengurangi dampak negatif terhadap lingkungan, serta mendorong terbentuknya sistem peternakan berbasis ekonomi sirkular yang berkelanjutan dan memberikan manfaat jangka panjang bagi masyarakat desa.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
        },
        bencana: {
            tag: 'Peta Tematik',
            title: 'Peta Rawan Bencana Desa Wonoanti',
            image: 'assets/images/peta_bencana.png',
            desc: `
                <p>Bencana alam yang paling sering terjadi di Desa Wonoanti adalah gempa bumi. Selain itu, mengingat kondisi geografis Desa Wonoanti yang didominasi oleh kawasan perbukitan dan pegunungan, wilayah ini juga memiliki potensi yang cukup tinggi terhadap tanah longsor, terutama pada musim hujan dengan curah hujan yang tinggi. Oleh karena itu, diperlukan upaya mitigasi untuk meningkatkan kesiapsiagaan masyarakat dalam menghadapi potensi bencana tersebut.</p>
                <p>Sebagai bentuk dukungan terhadap upaya mitigasi bencana di Desa Wonoanti, Tim KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan Sub Unit Wonoanti menyusun Peta Rawan Bencana Desa Wonoanti. Peta ini bertujuan memberikan informasi kepada masyarakat mengenai wilayah yang memiliki potensi risiko bencana, lokasi fasilitas pendukung penanggulangan bencana, serta meningkatkan kesiapsiagaan masyarakat dalam menghadapi kondisi darurat.</p>
                <p>Berdasarkan hasil pemetaan, sebagian besar wilayah Desa Wonoanti berada pada zona risiko rendah. Namun, terdapat beberapa area yang ditunjukkan dengan warna kuning hingga merah yang mengindikasikan wilayah dengan potensi kerawanan lebih tinggi. Area tersebut memerlukan perhatian khusus karena berpotensi mengalami tanah longsor akibat kondisi topografi yang berbukit dan curah hujan yang tinggi.</p>
                <p>Peta ini juga menampilkan titik kumpul evakuasi sebagai lokasi berkumpul sementara bagi masyarakat ketika terjadi bencana, sehingga proses evakuasi, pendataan warga, dan koordinasi penanganan darurat dapat dilakukan dengan lebih efektif. Selain itu, peta memuat lokasi klinik sebagai fasilitas pelayanan kesehatan yang berperan dalam memberikan pertolongan pertama kepada korban bencana.</p>
                <p>Melalui penyusunan peta ini, Tim KKN-PPM UGM Unit Tilik Tulakan berharap masyarakat dapat lebih mengenali potensi risiko di wilayahnya, mengetahui lokasi titik kumpul dan fasilitas kesehatan, serta berperan aktif dalam upaya mitigasi bencana dengan menjaga kelestarian lingkungan, meningkatkan kewaspadaan, dan mengikuti arahan pemerintah desa maupun instansi terkait. Dengan demikian, Desa Wonoanti diharapkan menjadi desa yang lebih tangguh dan siap menghadapi berbagai potensi bencana.</p>
            `,
            source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Sub Unit Wonoanti</span>'
        },
        sepang: {
            tag: 'Wisata',
            title: 'Pesona Alam Puncak Gunung Sepang',
            image: 'assets/images/wisata_sepang.jpg',
            desc: `
                <p>Keindahan alam Pacitan, Jawa Timur seolah tidak ada habisnya. Kabupaten yang berjuluk "Seribu Satu Goa" ini juga memiliki tempat yang sangat cocok bagi para pendaki dan pecinta alam bebas, yaitu <strong>Puncak Gunung Sepang</strong> yang berlokasi di Kecamatan Tulakan. Tempat ini menjadi salah satu destinasi favorit untuk mendaki sekaligus berkemah bagi anak-anak muda dan wisatawan domestik.</p>
                <p>Dari ketinggian puncak Gunung Sepang, panorama alam Pacitan dapat terlihat dengan sangat jelas, mulai dari hamparan perbukitan yang hijau hingga pemandangan indah pantai selatan Kota Pacitan yang memukau di kejauhan. Udara di puncak Gunung Sepang ini juga terkenal sangat sejuk dan segar karena dikelilingi oleh vegetasi hutan yang asri dan terjaga kelestariannya. Hal ini menjadikannya pilihan sempurna bagi para wisatawan yang ingin melepaskan penat dari hiruk-pikuk perkotaan di akhir pekan.</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 1.5rem 0;">
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/wisata_sepang2.jpg" alt="Keindahan Panorama Gunung Sepang" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Pemandangan panorama alam Pacitan yang mempesona dari puncak Gunung Sepang.</p>
                    </div>
                    <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center;">
                        <img src="assets/images/wisata_sepang3.jpg" alt="Suasana Berkemah di Gunung Sepang" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">Udaranya yang sejuk dan areanya yang luas membuat Puncak Gunung Sepang ideal untuk berkemah.</p>
                    </div>
                </div>

                <p>Puncak Gunung Sepang memiliki karakteristik dataran puncak yang cukup luas. Hal ini memudahkan para pendaki untuk mendirikan tenda dan berkemah secara berkelompok. Keunikan lain dari Gunung Sepang adalah lokasinya yang secara administratif terbagi menjadi empat wilayah lereng, yaitu Dusun Tembelang di Desa Tulakan, <strong>Dusun Sriten di Desa Wonoanti</strong>, Dusun Gadungan di Desa Padi, dan Dusun Pagerejo di Desa Bungur. Dusun-dusun ini merupakan lembah asri yang mengelilingi kaki gunung.</p>
                <p>Untuk mencapai puncak, pendaki membutuhkan waktu sekitar 1 hingga 2 jam perjalanan kaki. Dari pusat Kota Pacitan, jarak menuju lereng gunung adalah sekitar 45 kilometer. Akses jalan menuju lereng dapat ditempuh dengan kendaraan roda dua maupun roda empat. Setibanya di titik awal pendakian dekat SDN 1 Tulakan, pendaki harus berjalan kaki sejauh 2 kilometer melewati jalan rabat cor dengan tanjakan yang cukup curam melintasi kawasan hutan asri.</p>
                <p>Agar perjalanan mendaki Anda tetap aman dan menyenangkan, para pengunjung disarankan untuk merencanakan pendakian saat cuaca cerah dan tidak dalam kondisi turun hujan, mengingat jalur pendakian tanah di kawasan hutan akan menjadi licin. Saat cuaca cerah, pendaki dapat mengabadikan fenomena matahari terbit (sunrise) maupun matahari terbenam (sunset) yang sangat menawan dari atas puncak.</p>
            `,
            source: 'Sumber: <a href="https://timesindonesia.co.id/wisata/390923/menikmati-keindahan-alam-pacitan-dari-puncak-gunung-sepang" target="_blank" rel="noopener noreferrer" style="color: #6b7280; text-decoration: underline;">TIMES Indonesia</a>'
        }
    };

    window.openPotentialModal = (key) => {
        const data = potentialData[key];
        if (!data) return;

        potentialModalImg.src = data.image;
        potentialModalImg.alt = data.title;
        potentialModalTag.textContent = data.tag;
        potentialModalTitle.textContent = data.title;
        potentialModalDesc.innerHTML = data.desc;
        potentialModalSource.innerHTML = data.source;

        potentialModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    window.closePotentialModal = () => {
        potentialModal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Close potential modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (potentialModal && potentialModal.classList.contains('open')) {
                closePotentialModal();
            }
        }
    });
});
