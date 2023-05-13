 +(function() {
  const cEl = function(elem, props = {}, ...children) {
   let element = document.createElement(elem);
   if (props && typeof props == 'object') {
    for (let prop in props) {
     element[prop] = props[prop];
    }
   }
   children && element.append(...children);
   return element;
  }
  const elId = (id) => document.getElementById(id);

  function isVisble(elem) {
   let coords = elem.getBoundingClientRect();
   let windowHeight = document.documentElement.clientHeight;
   let topVisible = coords.top > 0 && coords.top < windowHeight;
   let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;
   return topVisible || bottomVisible;
  }

  setTimeout(() => {
   let unlockCourses = elId('unlock-courses');
   unlockCourses.classList.add('normal-TR');
   setTimeout(() => {
    unlockCourses.classList.remove('fadeRight');
    unlockCourses.classList.remove('normal-TR');
   }, 2000);
  }, 200);

  let reviews = ['Screenshot_20230424-112428.png', 'Screenshot_20230424-112512.png', /* 'Screenshot_20230423-185949.png', 'Screenshot_20230424-112428.png', 'Screenshot_20230424-112512.png', 'Screenshot_20230423-185949.png'*/ ];

  let fbInstaReviews = ['Screenshot_20230424-112428.png', 'Screenshot_20230424-112512.png', 'Screenshot_20230423-185949.png'];

  let reviewsParent = elId('reviews');
  let fbInstaReviewsParent = elId('fbInstaReview');

  for (let src of reviews) {
   reviewsParent.append(cEl('img', { src: 'res/' + src }));
  }

  for (let src of fbInstaReviews) {
   fbInstaReviewsParent.append(cEl('img', { src: 'res/' + src }));
  }

  let videoWatch = elId('video-watch');
  let video = videoWatch.nextElementSibling;
  video.addEventListener('error', function(e) {
   alert('Error loading courses highlights video: ' + video.error.message);
   /*
  if (video.error) {
   switch (video.error.code) {
    case "MEDIA_ERR_NETWORK":
     alert("Network error - please try again later.");
     break;
    case "MEDIA_ERR_DECODE":
     alert("Video is broken..");
     break;
    case "MEDIA_ERR_SRC_NOT_SUPPORTED":
     alert("Sorry, your browser can't play this video.");
     break;
   }
  }*/
  });
  
  videoWatch.addEventListener('click', function() {
   video.play();
   video.scrollIntoView();
  });

  window.addEventListener('scroll', function() {
   if (!isVisble(video)) {
    if (!video.paused) {
     video.pause();
    }
   }
  });

  /* Timer starts here */
  
  if(!localStorage.getItem('course_start')) {
   alert('here')
   localStorage.setItem('course_start', Date.now());
  }

  function countdown(hr, min, sec) {
   let seconds = localStorage.getItem('affTimer') || 86400;
   let startDate = localStorage.getItem('course_start');
   /*
   if(startDate && Date.now() - startDate >= 86400) {
    seconds = 86400;
   }*/
   if(seconds <= 0) {
    seconds = 86400;
   }

   let countdownInterval = setInterval(function() {
    try {
     seconds--;
     localStorage.setItem('affTimer', seconds);
     if (seconds < 0) {
      clearInterval(countdownInterval);
     } else {
      let hoursLeft = Math.floor(seconds / 3600);
      let minutesLeft = Math.floor((seconds % 3600) / 60);
      let secondsLeft = seconds % 60;

      hr.textContent = String(hoursLeft).padStart(2, '0');
      min.textContent = String(minutesLeft).padStart(2, '0');
      sec.textContent = String(secondsLeft).padStart(2, '0');
     }
    } catch (e) {
     console.error(e.stack, 'here3')
    }
   }, 1000);
  }


  function timerComponent() {
   let timer = document.createElement('div');
   timer.className = "d-flex align-items-center justify-content-center font-weight-bold";

   let span = () => {
    let sp = document.createElement('span');
    sp.className = "border rounded p-1 px-2 mx-1";
    return sp;
   };
   let hr = span();
   let min = span();
   let sec = span();
   timer.append(hr, document.createTextNode(':'), min, document.createTextNode(':'), sec);
   countdown(hr, min, sec); // counts down from 24 hours
   return timer;
  }

  for (let timer of document.getElementsByClassName('timer')) {
   timer.append(timerComponent());
  }

  /* Timer ends here */

  const paymentForm = document.getElementsByName('paymentForm')[0];
  const dismissModal = elId('dismiss-modal');
  const modal = document.getElementsByClassName('modal')[0];

  dismissModal.addEventListener('click', function() {
   modal.classList.remove('d-block');
   modal.classList.remove('show');
   document.body.classList.remove('modal-open');
  });

  let unlock = document.getElementsByClassName('unlock');

  for (let btn of unlock) {
   btn.addEventListener('click', function(event) {
    modal.classList.add('d-block');
    modal.classList.add('show');

    document.body.classList.add('modal-open');
   });
  }

  paymentForm.addEventListener("submit", payWithPaystack, false);

  function payWithPaystack(event) {
   event.preventDefault();
   let { email, amount, currency } = paymentForm;

   if (+amount.value < 1000) {
    return alert('Error initiating request! Please check the amount and try again.');
   }
   elId('continuePayment').classList.add('d-none');
   this.getElementsByClassName('circle')[0].classList.remove('d-none');
   try {
   const handler = PaystackPop.setup({
    key: 'YOUR_PUBLIC_KEY', // Replace with your public key
    email: email.value || "ojilevictor11@gmail.com",
    amount: amount.value * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
    currency: currency.value, // Use GHS for Ghana Cedis or USD for US Dollars
    callback: function(response) {
     // dismiss modal
     modal.classList.remove('d-block');
     modal.classList.remove('show');
     document.body.classList.remove('modal-open');
     alert('Payment has been made successfully');
     //this happens after the payment is completed successfully
     var reference = response.reference;
     alert('Payment complete! Reference: ' + reference);
     // Make an AJAX call to your server with the reference to verify the transaction
    },
    onClose: function() {
     let continuePayment = elId('continuePayment');
     continuePayment.textContent = "Try again!";
     continuePayment.classList.remove('d-none');
     continuePayment.nextElementSibling.classList.add('d-none');

    },
   });
   handler.openIframe();
   } catch(e) {
    setTimeout(() => {
     alert('Sorry, there was a problem initiating this transaction!');
     let continuePayment = elId('continuePayment');
     continuePayment.textContent = "Try again!";
     continuePayment.classList.remove('d-none');
     continuePayment.nextElementSibling.classList.add('d-none');
    }, 200);
   }
  }
  /* Scroll to top */

  let bottomToTop = document.getElementsByClassName('bottomToTop')[0];
  bottomToTop.onclick = () => document.body.scrollIntoView();

  window.addEventListener('scroll', function() {
   if (document.documentElement.scrollTop >= window.innerHeight) {
    bottomToTop.classList.remove('d-none');
   } else {
    bottomToTop.classList.add('d-none');
   }
  });

 })()