<template>
  <div class="content-wrapper">
    <h1>Impressum</h1>
    <!-- <SiteLogo class="logo-component" /> -->
    <img class="logo" :src="imageUrl()" alt="Bild einer Katze mit Hut" />

    <!-- <img class="site-logo" :src="imageUrl()" alt="Bild einer Katze mit Hut" />
      <h1 class="site-name-headline" data-cy="headline">Cat Herder</h1> -->

    <p class="text">
      <span
        >Cat Herder wird entwickelt von
        <a
          href="https://github.com/wiebken-n/"
          target="_blank"
          alt="Link zum Github Repository von Cat Herder"
          >wiebken-n</a
        >.
      </span>
      <span>
        <a
          href="https://github.com/wiebken-n/cat-herder"
          target="_blank"
          alt="Link zum Github Repository von Cat Herder"
          >Hier</a
        >
        geht's entlang zum Github Repository des Projekts.
      </span>

      <!-- <svg class="github-icon">
            <use xlink:href="@/assets/icons.svg#github" fill="currentcolor" />
          </svg> -->
    </p>

    <div class="credit-container">
      <h2>Bildnachweise:</h2>
      <ul>
        <li>
          Katzenavatare von
          <a
            target="_blank"
            href="https://www.freepik.com/free-vector/lovely-cat-breed-set_834954.htm#query=cat%20avatar&position=21&from_view=search&track=ais&uuid=f0a93d7e-5b8e-4b39-8628-581f3a99e2b0"
            >Freepik</a
          >
        </li>
        <li>
          Weiße Katze von
          <a
            target="_blank"
            href="https://www.freepik.com/free-vector/white-cat-doodle-element_13311357.htm"
            >rawpixel.com</a
          >
          auf Freepik
        </li>
        <li>
          Hut von
          <a
            target="_blank"
            href="https://www.freepik.com/free-vector/hand-drawn-hat-cartoon-illustration_82457792.htm#query=cowboy%20hat%20icon&position=12&from_view=search&track=ais&uuid=b898734b-b536-412d-b044-914a36ef76a7"
            >Freepik</a
          >
        </li>
        <li>Icons von <a target="_blank" href="https://fontawesome.com/">Fontawesome</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
function imageUrl() {
  return new URL(`/src/assets/images/catwithhat.webp`, import.meta.url).href
}
</script>

<style scoped>
.content-wrapper {
  display: grid;
  justify-items: center;
}

.text {
  display: grid;
  gap: 1rem;
  width: 80vw;
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.125rem;
  font-family: 'Roboto-Slab';
  display: flex;
  flex-direction: column;
}

img {
  margin-block: 5vh;
  height: 10rem;
}
.credit-container {
  width: 80vw;
}

ul,
li {
  list-style: inside;
  padding: 0;
  margin: 0;
  padding-left: 0px;
  font-size: 1rem;
  line-height: 2rem;
  font-family: 'Roboto-Slab';
  text-indent: -1.5rem;
  margin-left: 1rem;
}
/* 
.github-icon {
  color: var(--primary-darker);
  height: 1.5rem;
  scale: 1;
  transition: all 200ms ease-in-out;
}

.github-icon:hover {
  color: var(--old-rose);
  scale: 1.05;
} */

@media screen and (min-width: 500px) {
  .text,
  .credit-container {
    width: 400px;
  }
}
</style>
