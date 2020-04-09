<template>
    <div class="footer">

      <div class="uzh-eth" >
        <p v-if="this.$i18n.locale === 'en'">A joint initiative by</p>
        <p v-else>Ein gemeinsamer Effort von</p>
        <div  class="logo-wrapper">
            <a href="https://citizenscience.ch" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/logo-white.svg">
            </a> &nbsp;
            <a href="http://www.citizencyberlab.org/" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/CCL-logo-all-white.png" />
            </a> &nbsp;
        </div>
      </div>

      <div class="contact centered">
        <div class="buttons centered" style="text-align: center;">
          <b-button variant="border-transparent text-white" @click="openInNewTab('mailto:info@citizenscience.ch')">info@citizenscience.ch</b-button>
          <b-button variant="border-transparent text-white "  @click="openInNewTab('tel:+41446342197')">+41 44 634 21 97</b-button>
          <b-button variant="border-transparent text-white " @click="openInNewTab('https://goo.gl/maps/anvs2yRcgGhCcjif6')">Kurvenstrasse 17, 8006 Zürich</b-button>
        </div>
      </div>

      <!--<div class="sharing centered">
          <b-button variant="border-transparent text-white" @click="openInNewTab('mailto:info@citizenscience.ch')">Follow us on Twitter</b-button>
          <b-button variant="border-transparent text-white" @click="openInNewTab('https://www.facebook.com/CitSciZurich/')"> {{ $t('button-facebook') }}</b-button>
      </div>-->

      <div class="copyright">
          <p>
            © Except where otherwise noted, content on this site is licensed under a <a href='https://creativecommons.org/licenses/by-sa/3.0/' target='_blank'>Creative Commons License BY-SA 3.0 Unported</a>
          <p>
          <p style="margin-bottom: 0px;margin-top: -15px;">
            <a target='_blank' href="https://citizenscience.ch/en/terms" >Privacy Policy & Terms of Use</a>
            - 
            <router-link :to="{ name: 'about' }">Criteria for project publication</router-link>
          </p>
      </div>

    </div>

</template>

<script>

export default {
  name: 'Footer',
 
  methods: { 
    openInNewTab: function(url) {
      var win = window.open(url, '_blank');
      win.focus();
    }
  }
}
</script>

<style lang="scss">
  @import '@/styles/themes.scss';
  @import '@/styles/variables.scss';

  .main-app {
    position: relative;
    min-height: 100vh;
  }

  .loginBtn {
        padding: 0 8px;
    height: 42px;
    margin: 14px;
    font-size: 13px;
    border: 1px solid #231f20;
    color: #c5202e;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
    background: none;
  }


  .select-options {
    height:28px;
    width: 50px;
    border:0px;
    border-color: transparent;
  }

  #dropdownLang > ul{
    min-width:1rem
  }

  .beta {
        margin-left: 4px;
        font-size: 40px;
        //font-size: $font-size-tiny;
        line-height: 100%;
        text-transform: uppercase;
        font-weight: 700;
        //background-color: $color-secondary;
        //border-radius: $border-radius;
        padding: 4px;
        display: flex;
        align-self: flex-start;
      }

  .main-content {
    padding-bottom: 14.5rem;
  }

  .footer {
    background: linear-gradient(120deg, $color-gradient-start, $color-gradient-end );
    position:absolute; 
    bottom:0px; 
    width:100%; 
    overflow:hidden;

    .logo-wrapper {
      padding-top: $spacing-1;
      padding-bottom: $spacing-1;
      text-align: center;
      img {
        height: 48px;
      }
    }

    .uzh-eth {
      text-align: center;
      margin-bottom: $spacing-2;

      span {
        font-size: $font-size-small/1.25;
        color: white;
        display: block;
        margin-bottom: $spacing-2;
      }

      p {
        font-size: $font-size-small/1.25;
        color: white;
        display: block;
        margin-bottom: $spacing-2;
        margin-top:10px;
      }

      img {
        height: 46px;
        cursor: pointer;
      }
    }

    .contact {
      //margin-bottom: $spacing-1;
      .button {
        display: block;
        margin: auto;
      }
    }

    .sharing {
      width: 100%;
      background-color: rgba( $color-secondary-shade-20, 0.5 );
      padding: $spacing-1 0;

      .button {
        display: block;
        margin: auto;
      }
    }

    .copyright {
      background-color: rgba( $color-secondary-shade-20, 0.5 );
      padding: 0 $spacing-3;
      padding-bottom: $spacing-1;
      p {
        text-align: center;
        color: rgba(255,255,255,0.5);
        font-size: $font-size-small / 1.25;
        a {
          color: rgba(255,255,255,0.5);
          text-decoration: underline;

          &:active {
            color: rgba(255,255,255,0.75);
          }
          @media (hover: hover) {
            &:hover {
              color: rgba(255,255,255,0.75)
            }
          }
        }
      }
    }

}

</style>
