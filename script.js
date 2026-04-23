window.addEventListener("load", () => {
  const envelopeScreen = document.getElementById("envelopeScreen");

  if (envelopeScreen) {
    envelopeScreen.style.opacity = "1";
    envelopeScreen.style.visibility = "visible";
  }
});

// Обратный отсчёт до 12 июня 2026, 00:00
const weddingDate = new Date("2026-07-10T00:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    document.getElementById("days").innerText = "0";
    document.getElementById("hours").innerText = "0";
    document.getElementById("minutes").innerText = "0";
    document.getElementById("seconds").innerText = "0";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
  document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
  document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();


const form = document.getElementById("rsvp-form");
const formMessage = document.getElementById("form-message");

if (form) {

  let isSending = false;

  form.addEventListener("submit", async function(e) {

    e.preventDefault();

    if (isSending) return;

    isSending = true;

    const submitBtn = form.querySelector(".submit-btn");

    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";

    const formData = new FormData(form);

    try {

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {

        form.reset();

        if (formMessage) {
          formMessage.textContent = "Спасибо! Анкета отправлена 💌";
        }

      } else {

        if (formMessage) {
          formMessage.textContent = "Ошибка отправки";
        }

      }

    } catch (error) {

      if (formMessage) {
        formMessage.textContent = "Ошибка соединения";
      }

    } finally {

      isSending = false;

      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }

  });

}


// Плавное появление элементов при скролле
const fadeItems = document.querySelectorAll(".fade-in");

if (fadeItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  fadeItems.forEach((el) => {
    observer.observe(el);
  });
}


// Анимация маленьких фото
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".memories-collage");
  const finalPhoto = document.querySelector(".final-photo");
  const smallPhotos = document.querySelectorAll(".overlay-small");

  if (!section || !finalPhoto || !smallPhotos.length) return;

  // Здесь меняешь конечные точки
  // x = вправо внутри final-photo
  // y = вниз внутри final-photo
  // endRotate = как фото должно лежать в конце
  // spins = сколько полных оборотов сделать в полёте
  const targets = {
    "small-1": { x: 45, y: 105, endRotate: 0, spins: 2 },
    "small-2": { x: 45, y: 50, endRotate: 0, spins: 2 },
    "small-3": { x: 240, y: 90, endRotate: 0, spins: 2 },
    "small-4": { x: 300, y: 200, endRotate: 0, spins: 2 }
  };

  smallPhotos.forEach((photo) => {
    photo.addEventListener("click", () => {
      if (photo.classList.contains("is-flying") || photo.classList.contains("is-landed")) {
        return;
      }

      const className = [...photo.classList].find((cls) => cls.startsWith("small-"));
      const config = targets[className];
      if (!config) return;

      const sectionRect = section.getBoundingClientRect();
      const photoRect = photo.getBoundingClientRect();
      const finalRect = finalPhoto.getBoundingClientRect();

      const startLeft = photoRect.left - sectionRect.left;
      const startTop = photoRect.top - sectionRect.top;

      const endLeft = finalRect.left - sectionRect.left + config.x;
      const endTop = finalRect.top - sectionRect.top + config.y;

      const deltaX = endLeft - startLeft;
      const deltaY = endTop - startTop;

      const totalRotate = config.spins * 360 + config.endRotate;

      photo.classList.add("is-flying");

      section.appendChild(photo);

      photo.style.position = "absolute";
      photo.style.left = `${startLeft}px`;
      photo.style.top = `${startTop}px`;
      photo.style.right = "auto";
      photo.style.bottom = "auto";
      photo.style.margin = "0";
      photo.style.zIndex = "50";
      photo.style.transform = "rotate(0deg)";

      const animation = photo.animate(
        [
          {
            left: `${startLeft}px`,
            top: `${startTop}px`,
            transform: "rotate(0deg)",
            offset: 0
          },
          {
            left: `${startLeft + deltaX * 0.12}px`,
            top: `${startTop + deltaY * 0.18}px`,
            transform: `rotate(${totalRotate * 0.18}deg)`,
            offset: 0.18
          },
          {
            left: `${startLeft + deltaX * 0.28}px`,
            top: `${startTop + deltaY * 0.38}px`,
            transform: `rotate(${totalRotate * 0.38}deg)`,
            offset: 0.38
          },
          {
            left: `${startLeft + deltaX * 0.5}px`,
            top: `${startTop + deltaY * 0.62}px`,
            transform: `rotate(${totalRotate * 0.62}deg)`,
            offset: 0.62
          },
          {
            left: `${startLeft + deltaX * 0.76}px`,
            top: `${startTop + deltaY * 0.84}px`,
            transform: `rotate(${totalRotate * 0.9}deg)`,
            offset: 0.84
          },
          {
            left: `${endLeft}px`,
            top: `${endTop}px`,
            transform: `rotate(${config.endRotate}deg)`,
            offset: 1
          }
        ],
        {
          duration: 2200,
          easing: "cubic-bezier(0.22, 0.8, 0.2, 1)",
          fill: "forwards"
        }
      );

      animation.onfinish = () => {
        photo.style.left = `${endLeft}px`;
        photo.style.top = `${endTop}px`;
        photo.style.transform = `rotate(${config.endRotate}deg)`;
        photo.classList.remove("is-flying");
        photo.classList.add("is-landed");
      };
    });
  });
});

// Музыка на сайте
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");

  if (!audio || !toggleBtn) return;

  let musicStarted = false;

  function updateButton() {
    toggleBtn.textContent = audio.paused ? "▶" : "❚❚";
  }

  function tryPlayMusic() {
    audio.volume = 1;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicStarted = true;
          updateButton();
        })
        .catch(() => {
          updateButton();
        });
    }
  }

  // Пытаемся запустить сразу
  tryPlayMusic();

  // Если браузер запретил автозапуск, запускаем при первом действии пользователя
  function startOnFirstInteraction() {
    if (!musicStarted) {
      tryPlayMusic();
    }

    document.removeEventListener("click", startOnFirstInteraction);
    document.removeEventListener("touchstart", startOnFirstInteraction);
    document.removeEventListener("keydown", startOnFirstInteraction);
  }

  document.addEventListener("click", startOnFirstInteraction, { once: true });
  document.addEventListener("touchstart", startOnFirstInteraction, { once: true });
  document.addEventListener("keydown", startOnFirstInteraction, { once: true });

  // Кнопка пауза/воспроизведение
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (audio.paused) {
      audio.play()
        .then(() => {
          musicStarted = true;
          updateButton();
        })
        .catch((error) => {
          console.error("Не удалось включить музыку:", error);
        });
    } else {
      audio.pause();
      updateButton();
    }
  });

  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);

  updateButton();
});

document.addEventListener("DOMContentLoaded", () => {
  const envelopeScreen = document.getElementById("envelopeScreen");
  const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
  const audio = document.getElementById("bg-music");

  if (!envelopeScreen || !openEnvelopeBtn) return;

  document.body.classList.add("envelope-locked");

  openEnvelopeBtn.addEventListener("click", () => {
    envelopeScreen.classList.add("is-opening");

    if (audio) {
      audio.play().catch(() => {});
    }

    setTimeout(() => {
      envelopeScreen.classList.add("is-hidden");
      document.body.classList.remove("envelope-locked");
    }, 2400);
  });
});

window.addEventListener("load", () => {
  const pageLoader = document.getElementById("pageLoader");
  const envelopeScreen = document.getElementById("envelopeScreen");

  if (pageLoader) {
    pageLoader.classList.add("is-hidden");
  }

  if (envelopeScreen) {
    envelopeScreen.style.opacity = "1";
    envelopeScreen.style.visibility = "visible";
  }
});