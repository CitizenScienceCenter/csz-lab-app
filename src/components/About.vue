<template>
  <b-container>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered">{{ $t('about-header') }}</h1>

        <b-row class="mt-5">
        <b-col cols="12">

          <b-tabs pills content-class="mt-5 mb-5" active-nav-item-class="font-weight-bold" fill>

            <b-tab :title="$t('about-overview')" style="outline: none">
               <p>
                <b>{{ $t('about-question-1') }}</b><br>
                {{ $t('about-answer-1') }}
              </p>
              <p>
                <b>{{ $t('about-question-2') }}</b><br>
              
                <p v-html="$t('about-answer-2',
                {
                'link1': `<a target='_blank' href='https://en.wikipedia.org/wiki/Citizen_science'>Wikipedia</a>`
                  })">            
              </p>
              <p>
                <b>{{ $t('about-question-3') }}</b><br>
                {{ $t('about-answer-3') }}  
              </p>
              <p>
                <b>{{ $t('about-question-4') }}</b><br>
                {{ $t('about-answer-4') }}    
              </p>
              <p>
                
                <p v-html="$t('about-answer-5',
                {
                'criteria': `<a target='_blank' href='https://en.wikipedia.org/wiki/Citizen_science'></a>`
                  })">          
              </p>
              <p>
                <b>{{ $t('about-question-6') }}</b><br>
                <p v-html="$t('about-answer-6',
                {
                'pybossa': `<a target='_blank' href='https://github.com/Scifabric/pybossa'>PyBossa</a>`,
                'csgit': `<a target='_blank' href='https://github.com/CitizenScienceCenter'>Github</a>`
                  })">          
              </p>
            

            </b-tab>

            <b-tab :title="$t('about-howitworks')" style="outline: none">
              {{ $t('about-how-header1') }}
              {{ $t('about-how-header2') }}
              <ul style="list-style-type: square;margin-left:30px;margin-top:20px;">
                <li>{{ $t('about-how-header-list1') }}</li>
                <li>{{ $t('about-how-header-list2') }}</li>
                <li>{{ $t('about-how-header-list3') }}</li>
                <li>{{ $t('about-how-header-list4') }}</li>
              </ul>

              {{ $t('about-how-header3') }}
              
              <br><br>
              <b>{{ $t('about-how-step0') }} </b><br><br>
              <b>{{ $t('about-how-step1') }} </b><br>

              {{ $t('about-how-step1-label') }} 

              <ul style="list-style-type: square;margin-left:30px;margin-top:20px;">
               <li>{{ $t('about-how-step1-list1') }} 
                <i>{{ $t('about-how-step1-list1-note') }} </i>
                </li>

              <li>{{ $t('about-how-step1-list2') }}</li>
                <ul style="list-style-type: circle;margin-left:20px;">
                  <li>{{ $t('about-how-step1-list3') }}</li>
                  <li>{{ $t('about-how-step1-list4') }}</li>
                  <li>{{ $t('about-how-step1-list5') }}</li>
                  <li>{{ $t('about-how-step1-list6') }}</li>
                </ul>
              </ul>

              <p>{{ $t('about-how-step1-label2') }} </p>

              {{ $t('about-how-step1-note') }}:<br>
              - {{ $t('about-how-step1-note1') }} <br>
              - {{ $t('about-how-step1-note2') }} 

              <br><br>

              <b>{{ $t('about-how-step2') }} </b>
              <p> {{ $t('about-how-step2-label1') }}</p>

              <b>{{ $t('about-how-step3') }}</b><br>
              {{ $t('about-how-step3-label1') }}<br>
              {{ $t('about-how-step3-label2') }}<br>
              {{ $t('about-how-step3-label3') }}<br>
              {{ $t('about-how-step3-label4') }}<br>
              {{ $t('about-how-step3-label5') }}<br>
              {{ $t('about-how-step3-label6') }}<br>

              <br>

              <b>{{ $t('about-how-step4') }}</b><br>
              {{ $t('about-how-step4-label1') }}
              <br>
              <i>{{ $t('about-how-step4-label2') }}</i><br>
              <i>{{ $t('about-how-step4-label3') }}</i><br>
              <i>{{ $t('about-how-step4-label4') }}</i><br>
              <i>{{ $t('about-how-step4-label5') }}</i><br>
              <i>{{ $t('about-how-step4-label6') }}</i><br>

              <i>{{ $t('about-how-step4-note') }} </i>

              <br><br>

              <b>{{ $t('about-how-step5') }}</b><br>
              {{ $t('about-how-step5-label1') }} <br>
              {{ $t('about-how-step5-label2') }}<br> 
              {{ $t('about-how-step5-label3') }}<br>
              <i>{{ $t('about-how-step5-note') }}</i>

              <br><br>

              <b>{{ $t('about-how-step6') }}</b><br>
              {{ $t('about-how-step6-label1') }}
              <ul style="list-style-type: square;margin-left:30px;">
                <li>{{ $t('about-how-step6-list1') }}</li>
                <li>{{ $t('about-how-step6-list2') }}</li>
                <li> {{ $t('about-how-step6-list3') }}</li>
                    <ul style="list-style-type: circle;margin-left:30px;">
                    <li> {{ $t('about-how-step6-list4') }}</li>
                    <li> {{ $t('about-how-step6-list5') }}</li>
                    <li> {{ $t('about-how-step6-list51') }}</li>
                    <li> {{ $t('about-how-step6-list6') }}</li>
                    <li>{{ $t('about-how-step6-list7') }}</li>
                    </ul>
                <li> {{ $t('about-how-step6-list8') }}</li>
              </ul>
            
              <b>{{ $t('about-how-step7') }}</b><br> 
              {{ $t('about-how-step7-label1') }}
              {{ $t('about-how-step7-label2') }}

            </b-tab>

            <b-tab :title="$t('about-criteria')" style="outline: none">
              {{ $t('about-criteria-label1') }}
              <ul style="list-style-type: square;margin-left:30px;margin-top:20px;">
                <li>{{ $t('about-criteria-list1') }} </li>
                <li>{{ $t('about-criteria-list2') }}  </li>
                <li>{{ $t('about-criteria-list3') }} </li>
                <li>{{ $t('about-criteria-list4') }}  </li>
                <li>{{ $t('about-criteria-list5') }} </li>
                <li>{{ $t('about-criteria-list6') }} </li>
                <li>{{ $t('about-criteria-list7') }} </li>
                <li>{{ $t('about-criteria-list8') }} </li>
                <li>{{ $t('about-criteria-list9') }} </li>
                <li>{{ $t('about-criteria-list10') }} </li>
              </ul>
            </b-tab>

          </b-tabs>

        </b-col>
      </b-row>


       
      </b-col>
    </b-row>

      
  </b-container>

</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>

</style>
