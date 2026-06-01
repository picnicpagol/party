document.addEventListener("DOMContentLoaded", function () {
    // 1. Navbar Scroll Color Change & Scroll Top Button Toggle
    const navbar = document.querySelector(".custom-navbar");
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", function () {
        if (window.scrollY >= 100) {
            navbar.classList.add("navbar-scrolled");
            scrollTopBtn.style.display = "block";
        } else {
            navbar.classList.remove("navbar-scrolled");
            scrollTopBtn.style.display = "none";
        }
    });
    // স্ক্রল করার সাথে সাথে মেনু আইটেম অ্যাক্টিভ করার কাস্টম কোড
    window.addEventListener('scroll', () => {
        let sections = document.querySelectorAll('section'); // আপনার সব সেকশন (যেমন: <section id="about">)
        let navLinks = document.querySelectorAll('.custom-navbar .nav-link'); // মেনুর লিঙ্কগুলো

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // স্ক্রিনের মাঝামাঝি বা ৮০ পিক্সেল ওপরে আসলে সেকশন ডিটেক্ট করবে
            if (window.scrollY >= (sectionTop - 100)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // প্রথমে সবার থেকে অ্যাক্টিভ ক্লাস বাদ দেবে
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active'); // বর্তমান সেকশনের লিঙ্কে অ্যাক্টিভ ক্লাস যোগ করবে
            }
        });
    });

    // 2. Scroll Top Action
    scrollTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 3. Dynamic Price Filter for Packages Section
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    const packageCards = document.querySelectorAll(".package-card");

    priceRange.addEventListener("input", function () {
        const selectedMaxPrice = parseInt(priceRange.value);
        priceValue.textContent = selectedMaxPrice;

        packageCards.forEach(card => {
            const cardPrice = parseInt(card.getAttribute("data-price"));
            if (cardPrice <= selectedMaxPrice) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    // 4. Interactive Gallery Filter System
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");
    let currentActiveFilter = "all";

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove active status from all filter options
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            currentActiveFilter = this.getAttribute("data-filter");
            applyGalleryFiltering();
        });
    });

    function applyGalleryFiltering() {
        galleryItems.forEach(item => {
            // If the item matches filter selection
            if (currentActiveFilter === "all" || item.classList.contains(currentActiveFilter)) {
                // If it is one of the "load more" items, check if load more has been expanded
                if (item.classList.contains("d-none") && !isLoadMoreExpanded) {
                    item.style.setProperty("display", "none", "important");
                } else {
                    item.style.setProperty("display", "block", "important");
                }
            } else {
                item.style.setProperty("display", "none", "important");
            }
        });
    }

    // 5. Gallery Load More Functionality
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    let isLoadMoreExpanded = false;

    loadMoreBtn.addEventListener("click", function () {
        isLoadMoreExpanded = true;

        // Remove the display none class from the hidden grid elements
        galleryItems.forEach(item => {
            if (item.classList.contains("d-none")) {
                item.classList.remove("d-none");
            }
        });

        applyGalleryFiltering();
        this.style.display = "none"; // Hide button after expansion
    });

    // 6. Autofill package selection on clicking "বুক করুন" button
    const bookNowButtons = document.querySelectorAll(".btn-book-now");
    const selectPackageDropdown = document.getElementById("bookingPackage");

    bookNowButtons.forEach(button => {
        button.addEventListener("click", function () {
            const packageName = this.getAttribute("data-package");
            selectPackageDropdown.value = packageName;
        });
    });


    // ⚠️ এখানে আপনার আসল গুগল ওয়েব অ্যাপ ইউআরএল (Web App URL) লিংকটি বসান
    const scriptURL = 'https://script.google.com/macros/s/AKfycbySES0_ILiY_6_DVMckGZbA0S63WcXsi9W3M4zXeVzfJ3bVgc3VswMG5I6ZJRVB03NA/exec';

    // ========================================================
    // ১. ইন্টারেক্টিভ বুকিং ফর্ম সাবমিট হ্যান্ডলার
    // ========================================================
    const bookingForm = document.getElementById("interactiveBookingForm");
    const bookingAlert = document.getElementById("bookingAlert");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            // স্প্যাম বট প্রটেকশন চেক
            const honeypot = document.getElementById("bookingHoneypot");
            if (honeypot && honeypot.value !== "") {
                console.log("Spam Bot Detected!");
                e.preventDefault();
                return; // ডাটা সাবমিট হওয়া এখানেই ব্লক করে দেবে
            }
            const submitBtn = bookingForm.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> প্রসেসিং হচ্ছে...`;

            fetch(scriptURL, { method: 'POST', body: new FormData(bookingForm) })
                .then(response => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    if (bookingAlert) {
                        bookingAlert.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>অভিনন্দন!</strong> আপনার বুকিং রিকোয়েস্টটি সফলভাবে গুগল শিটে জমা হয়েছে। আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    } else {
                        alert('অভিনন্দন! আপনার বুকিং রিকোয়েস্টটি সফলভাবে গুগল শিটে জমা হয়েছে।');
                    }
                    bookingForm.reset();
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                })
                .catch(error => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    alert('দুঃখিত! ডাটা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
                    console.error('Error!', error.message);
                });
        });
    }

    // ========================================================
    // ২. ইন্টারেক্টিভ কন্টাক্ট ফর্ম সাবমিট হ্যান্ডলার
    // ========================================================
    const contactForm = document.getElementById("interactiveContactForm");
    const contactAlert = document.getElementById("contactAlert");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> পাঠানো হচ্ছে...`;

            fetch(scriptURL, { method: 'POST', body: new FormData(contactForm) })
                .then(response => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    if (contactAlert) {
                        contactAlert.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>ধন্যবাদ!</strong> আপনার মেসেজটি সফলভাবে গুগল শিটে সেভ হয়েছে। কাস্টমার কেয়ার টিম ২৪ ঘণ্টার মধ্যে রিপ্লাই দেবে।
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    } else {
                        alert('ধন্যবাদ! আপনার মেসেজটি সফলভাবে গুগল শিটে সেভ হয়েছে।');
                    }
                    contactForm.reset();
                    document.getElementById("contactAlert")?.scrollIntoView({ behavior: "smooth" });
                })
                .catch(error => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    alert('দুঃখিত! মেসেজটি পাঠানো যায়নি।');
                    console.error('Error!', error.message);
                });
        });
    }

    // ========================================================
    // ৩. ইন্টারেক্টিভ নিউজলেটার ফর্ম সাবমিট হ্যান্ডলার
    // ========================================================
    const newsletterForm = document.getElementById("interactiveNewsletterForm");
    const newsletterAlert = document.getElementById("newsletterAlert");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = newsletterForm.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

            fetch(scriptURL, { method: 'POST', body: new FormData(newsletterForm) })
                .then(response => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    if (newsletterAlert) {
                        newsletterAlert.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show small py-2" role="alert">
                                <strong>ধন্যবাদ!</strong> নিউজলেটারে সাবস্ক্রিপশন সফল হয়েছে।
                                <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    } else {
                        alert('ধন্যবাদ! নিউজলেটারে সাবস্ক্রিপশন সফল হয়েছে।');
                    }
                    newsletterForm.reset();
                })
                .catch(error => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    alert('দুঃখিত! সাবস্ক্রাইব করা যায়নি। আবার চেষ্টা করুন।');
                    console.error('Error!', error.message);
                });
        });
    }
// ========================================================
// ৪. প্রি-লোডার এবং ব্যাক-টু-টপ কাস্টম জাভাস্ক্রিপ্ট
// ========================================================

// পেজ পুরোপুরি লোড হলে প্রি-লোডার স্ক্রিন বন্ধ হবে
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";
    }
});

// স্ক্রোল করলে ব্যাক-টু-টপ বাটন দেখাবে এবং ক্লিক করলে ওপরে নিয়ে যাবে
document.addEventListener("DOMContentLoaded", function () {
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.addEventListener("scroll", function () {
            // ২০০ পিক্সেল নিচে স্ক্রোল করলে বাটন আসবে
            if (window.scrollY > 200) {
                backToTopBtn.style.display = "flex";
            } else {
                backToTopBtn.style.display = "none";
            }
        });

        // বাটনে ক্লিক করলে স্মুথলি ওপরে স্ক্রোল হবে
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});

    

    // হিরো স্লাইডার অটোমেটিক চালু করার কাস্টম কোড
    const myCarousel = document.getElementById('heroCarousel');
    if (myCarousel) {
        new bootstrap.Carousel(myCarousel, {
            interval: 2000, // ৩ সেকেন্ড পর পর ছবি পরিবর্তন হবে
            ride: 'carousel',
            wrap: true      // শেষ ছবির পর আবার ১ম ছবি থেকে শুরু হবে
        });
    }



    // Typing Text Animation

    const typedElement = document.getElementById('typed');

    if (typedElement) {
        new Typed('#typed', {
            strings: [
                'চলো হারিয়ে যাই প্রকৃতির মাঝে, আনন্দের নতুন খোঁজে!',
                'বন্ধুদের সাথে আড্ডায়, হাসি আর আনন্দের মেলায় !!',
                'সেরা স্টুডেন্ট ট্যুর।',
                'চমৎকার ফ্যামিলি গেট-টুগেদার।',
                'প্রফেশনাল কর্পোরেট ইভেন্ট।',
                'স্মরণীয় পিকনিক উৎসব!'
            ],
            typeSpeed: 60,      // টাইপিংয়ের গতি (মিলিসেকেন্ডে)
            backSpeed: 40,      // লেখা মুছে যাওয়ার গতি
            backDelay: 1500,    // একটা লেখা শেষ হওয়ার পর কতক্ষণ অপেক্ষা করবে
            loop: true,         // অ্যানিমেশনটি বারবার চলতেই থাকবে
            showCursor: true,   // লেখার শেষে টাইপিং কার্সার (|) দেখাবে
            cursorChar: '|'     // কার্সার আইকন কী হবে
        });
    }

    // অটোমেটিক কারেন্ট বছর আপডেট

    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear(); // এটি অটোমেটিক ২০২৬ বা পরবর্তী বছর বসিয়ে দেবে
    }

    // ========================================================
    // ৫. অটোমেটিক পেমেন্ট নম্বর কপি সিস্টেম (Click to Copy)
    // ========================================================

    const copyBoxes = document.querySelectorAll('.copy-number-box');

    copyBoxes.forEach(box => {
        box.addEventListener('click', function () {
            const numberToCopy = this.getAttribute('data-number');

            // ব্রাউজারের ক্লিপবোর্ডে কপি করা
            navigator.clipboard.writeText(numberToCopy).then(() => {
                // আইকন পরিবর্তন করে সাকসেস আইকন দেখানো
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-check text-success';
                    setTimeout(() => {
                        icon.className = 'far fa-copy text-muted';
                    }, 2000); // ২ সেকেন্ড পর আবার আগের আইকন ফিরে আসবে
                }

                // স্ক্রিনে একটি ছোট টোস্ট বা কাস্টম মেসেজ অ্যালার্ট
                alert('নম্বরটি সফলভাবে কপি হয়েছে: ' + numberToCopy);
            }).catch(err => {
                console.error('কপি করা যায়নি: ', err);
            });
        });
    });


    const packageSelect = document.getElementById("bookingPackage");

    if (packageSelect) {
        // বাটনের ওপরে প্রাইস দেখানোর জন্য একটি নতুন ডিভ তৈরি করা
        const priceDiv = document.createElement("div");
        priceDiv.id = "dynamicPriceDisplay";
        priceDiv.className = "text-end fw-bold my-2 text-success fs-5";
        packageSelect.parentElement.appendChild(priceDiv);

        packageSelect.addEventListener("change", function () {
            let selectedValue = this.value;
            let price = "০";

            if (selectedValue.includes("স্টুডেন্ট")) price = "১,৫০০";
            else if (selectedValue.includes("ফ্যামিলি")) price = "৩,৫০০";
            else if (selectedValue.includes("কর্পোরেট")) price = "৫,০০০";

            priceDiv.innerHTML = `নির্বাচিত প্যাকেজ মূল্য: ৳${price}`;
        });
    }



    // লাইভ বুকিং পপ-আপ নোটিফিকেশন (অটো-লুপ)

    const notificationDiv = document.createElement("div");
    notificationDiv.className = "booking-notification";
    document.body.appendChild(notificationDiv);

    const fakeBookings = [
        "মিরপুর থেকে তৌসিফ ফ্যামিলি প্যাকেজ বুক করেছেন!",
        "উত্তরা থেকে টেক্সটাইল মিলস টিম কর্পোরেট ইভেন্ট বুক করেছে!",
        "ধানমণ্ডি থেকে রাফাত অ্যান্ড ফ্রেন্ডস স্টুডেন্ট ট্যুর কনফর্ম করেছে!",
        "গাজীপুর থেকে একটি গ্রুপ মাত্র ১০ মিনিট আগে বুকিং মানি পাঠিয়েছে!"
    ];

    function showNotification() {
        if (window.innerWidth < 768) return; // মোবাইলে স্ক্রিন জ্যাম রোধে বন্ধ থাকবে

        const randomIndex = Math.floor(Math.random() * fakeBookings.length);
        notificationDiv.innerHTML = `<i class="fas fa-bell text-success me-2"></i> ${fakeBookings[randomIndex]}`;

        notificationDiv.style.display = "block";

        // ৫ সেকেন্ড পর নোটিফিকেশনটি হাইড হবে
        setTimeout(() => {
            notificationDiv.style.display = "none";
        }, 5000);
    }

    // সাইটে ঢোকার ১০ সেকেন্ড পরে প্রথম নোটিফিকেশন আসবে, এবং প্রতি ৪০ সেকেন্ড পর পর বদলাবে
    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 40000);
    }, 10000);

});
// ========================================================
// ৬. ডাইনামিক ডার্ক মোড টগল সিস্টেম (Local Storage সহ)
// ========================================================
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("darkModeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const htmlElement = document.documentElement;

    // ১. আগে থেকে ইউজার ডার্ক মোড অন করে রেখেছিল কি না তা চেক করা
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        htmlElement.setAttribute("data-bs-theme", "dark");
        if (themeIcon) themeIcon.className = "fas fa-moon text-info fs-5"; // চাঁদের আইকন
    } else {
        htmlElement.setAttribute("data-bs-theme", "light");
        if (themeIcon) themeIcon.className = "fas fa-sun text-warning fs-5"; // সূর্যের আইকন
    }

    // ২. বাটনে ক্লিক করলে থিম টগল হওয়ার ইভেন্ট
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            const currentTheme = htmlElement.getAttribute("data-bs-theme");
            
            if (currentTheme === "light") {
                // লাইট থেকে ডার্ক মোড করা
                htmlElement.setAttribute("data-bs-theme", "dark");
                themeIcon.className = "fas fa-moon text-info fs-5";
                localStorage.setItem("theme", "dark"); // ব্রাউজারে সেভ থাকবে
            } else {
                // ডার্ক থেকে লাইট মোড করা
                htmlElement.setAttribute("data-bs-theme", "light");
                themeIcon.className = "fas fa-sun text-warning fs-5";
                localStorage.setItem("theme", "light"); // ব্রাউজারে সেভ থাকবে
            }
        });
    }
});






// GLightbox ইনিশিয়েট করা
const lightbox = GLightbox({
    selector: '.glightbox', // কোন ক্লাসের ওপর কাজ করবে
    loop: true,            // শেষ ছবির পর আবার প্রথম ছবি আসবে
    zoomable: true,        // ছবি জুম করার অপশন থাকবে
    draggable: true        // মোবাইলে সোয়াইপ করে ছবি চেঞ্জ করা যাবে
});

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! You will receive our latest picnic tips and exclusive offers.');
    newsletterForm.reset();
});

