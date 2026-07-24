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
            `,
            source: ''
        },
        umkm: {
            tag: 'UMKM',
            title: 'Sentra Anyaman Bambu Tradisional',
            image: 'assets/images/umkm.png',
            desc: `
                <p>Desa Wonoanti dikenal luas sebagai sentra kerajinan anyaman bambu terkemuka di Kabupaten Pacitan. Keterampilan menganyam ini merupakan warisan turun-temurun yang terus dilestarikan dan dikembangkan oleh warga desa.</p>
                <p>Produk yang dihasilkan sangat beragam dan fungsional, mulai dari perabotan rumah tangga tradisional (seperti kukusan, besek, caping, dan tempat nasi) hingga produk dekorasi interior modern yang artistik dan bernilai estetika tinggi.</p>
                <p>Berkat kreativitas para pengrajin dan dukungan program digitalisasi UMKM desa, produk anyaman bambu Wonoanti kini telah merambah pasar nasional dan beberapa kali dipamerkan dalam ajang pameran kriya tingkat ekspor.</p>
            `,
            source: ''
        },
        wisata: {
            tag: 'Wisata',
            title: 'Wisata Alam & Edukasi Kriya',
            image: 'assets/images/wisata.png',
            desc: `
                <p>Konsep wisata di Desa Wonoanti memadukan keindahan panorama alam perdesaan dengan edukasi kriya anyaman bambu yang interaktif bagi wisatawan.</p>
                <p>Wisatawan dapat menikmati suasana pedesaan yang sejuk, berjalan menyusuri pematang sawah yang hijau, serta menyusuri keasrian sungai desa yang jernih. Di samping keindahan alamnya, daya tarik utama desa ini adalah paket eduwisata kriya, di mana pengunjung dapat belajar langsung teknik menganyam bambu dari para pengrajin lokal berpengalaman dan membawa pulang hasil karyanya sendiri sebagai buah tangan.</p>
                <p>Pengembangan desa wisata ini dikelola secara kolaboratif oleh Kelompok Sadar Wisata (Pokdarwis) dan Badan Usaha Milik Desa (BUMDes) demi meningkatkan perekonomian lokal secara berkelanjutan.</p>
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
            tag: 'Kegiatan Proker',
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
            title: 'Pelatihan Pembuatan Pupuk Kompos Feses Ternak',
            image: 'assets/images/proker_kompos.jpg',
            desc: `
                <p>Sektor peternakan memegang peranan penting dalam penggerak ekonomi masyarakat pedesaan, di mana mayoritas penduduknya berprofesi sebagai petani dan peternak. Namun, seiring dengan populasi ternak yang dipelihara, volume limbah peternakan, khususnya kotoran (feses) ternak, juga turut meningkat. Jika tidak dikelola dengan baik, penumpukan feses dari ternak seperti sapi, domba, maupun unggas dapat menimbulkan masalah lingkungan, mulai dari pencemaran udara akibat bau gas amonia, kontaminasi sumber air, hingga menjadi sarang bibit penyakit. Oleh karena itu, pengolahan limbah peternakan menjadi pupuk kompos merupakan salah satu langkah strategis yang tidak hanya menyelesaikan masalah pencemaran, tetapi juga memberikan nilai tambah bagi sektor pertanian.</p>
                <p>Sebagai bentuk dukungan terhadap upaya pemberdayaan masyarakat dan pelestarian lingkungan, Mahasiswa Kuliah Kerja Nyata Pembelajaran Pemberdayaan Masyarakat (KKN-PPM) Universitas Gadjah Mada Tilik Tulakan Periode 2 Tahun 2026 Tim KKN-PPM UGM Sub Unit Wonoanti menyelenggarakan kegiatan pelatihan pembuatan pupuk kompos di Dusun Sriten. Kegiatan yang dilaksanakan pada tanggal 5 Juli 2026 di Dusun Sriten, Desa Wonoanti, Kabupaten Pacitan, Jawa Timur ini diawali dengan pengenalan bahan dan diskusi interaktif yang dipandu oleh mahasiswa KKN. Kegiatan praktik langsung ini diikuti oleh 15 orang peternak setempat dengan penuh semangat dan antusiasme yang sangat seru. Kegiatan ini bertujuan untuk mengedukasi dan melatih para peternak dalam mengolah limbah kotoran hewan menjadi pupuk organik yang berkualitas, sehingga dapat menekan biaya pembelian pupuk kimia komersial sekaligus mengembalikan kesuburan tanah.</p>
                <p>Tahapan kegiatan dilanjutkan dengan pendataan potensi limbah dari masing-masing peternak yang hadir. Data yang dikumpulkan meliputi jenis ternak yang mendominasi, sistem pembersihan kandang, serta ketersediaan bahan karbon tambahan seperti jerami, sekam, atau dedaunan kering. Observasi bersama ini menjadi dasar dalam menentukan formulasi kompos and jenis bioaktivator yang paling sesuai dengan ketersediaan bahan baku lokal di Dusun Sriten.</p>
                <p>Proses pembuatan kompos dilakukan melalui metode fermentasi aerobik. Feses ternak yang kaya akan nitrogen dicampur dengan limbah pertanian sebagai sumber karbon untuk mencapai rasio C/N yang ideal. Campuran tersebut kemudian ditambahkan cairan bioaktivator dan molase untuk mempercepat proses dekomposisi. Selama proses pengomposan berlangsung, parameter fisik seperti suhu, kelembapan, dan aerasi terus dipantau serta dikendalikan melalui proses pembalikan tumpukan kompos secara berkala. Untuk memastikan kualitas kompos yang dihasilkan, proses ini melewati tiga fase dekomposisi utama.</p>
                <p><strong>Fase Mesofilik (Dekomposisi Awal)</strong> merupakan tahap yang terjadi pada 1 hingga 2 minggu pertama. Pada fase ini, mikroorganisme pengurai mulai aktif memecah senyawa organik yang mudah larut. Peternak diedukasi untuk menjaga tingkat kelembapan kompos agar tetap berada di kisaran ideal, yakni tidak terlalu kering agar mikroba tidak mati, dan tidak terlalu basah agar tidak menimbulkan bau busuk.</p>
                <p><strong>Fase Termofilik (Pemanasan)</strong> terjadi ketika suhu tumpukan kompos mencapai puncaknya, yang bisa melebihi 50–60°C. Fase ini sangat krusial dalam manajemen sanitasi. Suhu panas yang dihasilkan secara alami ini berfungsi untuk mematikan bakteri patogen agen penyakit yang mungkin terbawa dalam feses, serta mematikan biji-biji gulma. Pembalikan tumpukan kompos secara rutin pada fase ini sangat penting agar ketersediaan oksigen tetap terjaga.</p>
                <p><strong>Fase Pematangan (Kematangan dan Pendinginan)</strong> merupakan tahap akhir di mana suhu kompos kembali turun mendekati suhu lingkungan. Kompos yang sudah matang ditandai dengan warnanya yang menjadi kehitaman, teksturnya gembur menyerupai tanah, dan berbau khas tanah yang subur (earthy). Pada tahap ini, kompos sudah aman dan siap untuk diaplikasikan langsung pada tanaman pertanian tanpa memicu efek panas yang dapat merusak akar.</p>
                <p>Pupuk kompos yang dihasilkan dari program ini tidak hanya berfungsi sebagai penyedia unsur hara bagi tanaman, tetapi juga berperan penting sebagai pembenah tanah (soil conditioner). Penggunaan kompos secara rutin mampu memperbaiki struktur tanah dan merangsang aktivitas mikroorganisme yang menguntungkan. Informasi dan keterampilan ini memberikan wawasan baru bagi peternak Dusun Sriten bahwa kesehatan ternak, kebersihan kandang, dan produktivitas hasil pertanian merupakan satu kesatuan siklus yang saling menguntungkan.</p>
                <p>Melalui kegiatan pelatihan dan pendampingan yang penuh antusiasme ini, diharapkan Dusun Sriten dan Desa Wonoanti pada umumnya dapat memiliki sistem pengelolaan limbah peternakan yang mandiri. Ke depan, praktik ini diharapkan terus diterapkan secara berkelanjutan, sehingga mampu mengurangi ketergantungan pada pupuk kimia yang harganya fluktuatif, serta mendukung terciptanya ketahanan pangan dan peningkatan kesejahteraan masyarakat desa.</p>
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
