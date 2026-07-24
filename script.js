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

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from other buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            // Add to current button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    // Retrigger light scale animation
                    item.style.animation = 'fadeIn 0.4s ease';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

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
        // Collect currently filtered/visible items
        visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
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
