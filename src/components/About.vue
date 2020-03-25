<template>
  <b-container>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered">About</h1>
        <p>
          <b>What is the Citizen Science Project Builder?</b><br>
          The Citizen Science Project Builder is a web-based tool that allows researchers, students, and all members of the public to create and run Citizen Science Projects. 
        </p>
        <p>
          <b>What is a Citizen Science project?</b><br>
          In Citizen Science projects, volunteer contributors (“citizens”) and scientists work together to produce scientific knowledge. Projects may take many different forms, from classifying images of snakes to transcribing handwritten German dialect, from collecting samples of water to taking pictures of insects and plants. If you want to learn more about Citizen Science (including an extensive list of existing projects) Wikipedia (https://en.wikipedia.org/wiki/Citizen_science and https://de.wikipedia.org/wiki/Citizen_Science)  is a good starting point.
          </p>
        <p>
          <b>Which kind of projects can be created in the CS Project Builder?</b><br>
          In its initial version, the CS Project Builder allows users to perform complex data classification tasks. It supports projects where contributors can analyze or enrich existing data, typically large sets of images or texts (ie. satellite pictures, social media posts, etc.), as well as other media formats such as videos, audios, and scanned documents.
          Next step, the web-based tool will be integrated with a data collection (smartphone-based) tool. 
        </p>
        <p>
          <b>What is the aim of the CS Project Builder?</b><br>
          The CS Project Builder facilitates the implementation of CS projects by providing an interface that requires limited technical knowledge, and ideally little or no coding skills. Its aim is to facilitate the co-creation of Citizen Science projects by starting with the implementation of simple pilots. 
        </p>
        <p>
          Anybody with an idea for a data classification project can implement it here, as long as it complies with the platform criteria. Next step is to build around it an initial community of contributors (colleagues, friends, family, and more!) that will allow to test its scope, form, and potentials. By involving all contributors in the co-creation process, a lot can be learned about research questions, process, data, and mutual benefits, before deciding to spend more resources in a full-fledged implementation (ie. developing a project with a unique graphic style, dedicated features, etc. For more info on this option, please contact us).
        </p>
        <p>
          <b>A bit of history ...</b><br>
          The web interface for the CS Project Builder is inspired by the now discontinued Crowdcrafting platform. Its implementation is based on the open source crowdsourcing framework PyBossa. The code is publicly available under the ‘CitizenScienceCenter’ organisation on Github.
        </p>
      </b-col>
    </b-row>

      <b-row class="mt-5">
        <b-col cols="12">

          <b-tabs pills content-class="mt-5 mb-5" active-nav-item-class="font-weight-bold" fill>

            <b-tab title="How it Works" >

              The Project Builder supports projects where volunteer contributors can analyse or enrich existing data.

              In particular, it allows to:
              <ul style="list-style-type: square;margin-left:30px;margin-top:20px;">
                <li>Classify or describe large sets of images or text (ie. identify images, count objects, describe scenes) and social media content (tweets).</li>
                <li>Classify or describe sounds and video clips.</li>
                <li>Work on PDF documents (transcribe, translate, describe).</li>
                <li>Geo-code images or tweets, ie. mark their location on a map (note: this task requires some coding skills!).</li>
              </ul>

              Setting up a project involves a few simple steps:<br><br>

              <b>STEP 1: Create your project’s home page</b><br>

              To create your project, you start with choosing a nice and catchy title and an image to represent it (<1MB).

              Then, you need to provide:

              <ul style="list-style-type: square;margin-left:30px;margin-top:20px;">
               <li>A short description (120 characters)
                <it>Note:  this text is the most visible one, the equivalent of your project business card!</it>
                </li>

              <li>Additional text that explains in simple terms (each part 400 characters long):</li>
                <ul style="list-style-type: circle;margin-left:30px;">
                  <li>WHAT & WHY what is the purpose of your project, and why it is important;</li>
                  <li>HOW your volunteers can contribute, and how their contributions will be used;</li>
                  <li>WHO is behind the project;</li>
                  <li>ADDITIONAL information - including details about how contributors can contact or follow you.</li>
                </ul>
              </ul>

              <p>You have now created the homepage of your project.</p>

            Note: <br>
            - if you decide to leave the platform now, you will find the draft of your project under “Your profile” -> “Draft Projects” <br>
            - once you create your project draft, you will be able to change the description only at the end of the process from the “project overview” page. 

            <br><br>

            <b>STEP 2: Select the type of source file </b>
            <p>Select the kind of source files you want to work with. Options include: images (.jpg and .png), videos (.mp4), audios (.mp3), tweets, PDF.</p>

            <b>STEP 3: Select the type of task for contributors </b><br>
            Select the task you would like your contributors to work on.<br>
            For images possible tasks are: classify, describe, count.<br>
            For sounds possible tasks are: classify, describe.<br>
            For videos possible tasks are: classify, describe.<br>
            For PDF files possible tasks are: describe.<br>
            For Tweets possible tasks are: classify, describe.<br>

            <br>

            <b>STEP 4: Design your task protocol</b>
            Design your tasks, ie. what contributors should provide and how. Depending on your source files, these can be entering questions and answers, or describing text fields.

            Example for classifying images:
            Question: do you see a house in the image?
            Answer 1: Yes
            Answer 2: No
            Answer 3: I can’t say

            Note: you will NOT be able to change your task protocol later in the process. To do so, you need to create a new project. 

            <br><br>
            <b>STEP 5: Select the location of your source files (Import tasks)</b><br>
            It’s time to import your source files (images, videos, sounds, ...). <br>
            Possible import locations include: Dropbox, Flickr, Amazon S3 bucket, Google Spreadsheet (public), csv file.<br> 
            You will be able to add additional files also from the “project overview” page. 
            <br>
            <i>NOTE: the builder is NOT copying your file, it is linking to them. So make sure they stay in the original location for the duration of the project.</i>

            <br><br>
            <b>STEP 6: Project Overview page - Test and adjust your project</b><br>
            The draft of your project is ready. From the different tabs in this overview page, you can:
            <ul style="list-style-type: square;margin-left:30px;">
              <li> Info: overview the current description of the project</li>
              <li>Statistics: overview the current statistics for your projects</li>
              <li> Tasks: you can do multiple actions:</li>
                  <ul style="list-style-type: circle;margin-left:30px;">
                   <li> Import Tasks - import more source files via the provided importer (see step 4)</li>
                   <li> Task Presenter - if you have basic coding skills, you can change the protocol of your tasks (see Step 3)</li>
                   <li> Browse -  check the status of each task</li>
                   <li> Export Tasks - export tasks to JSON, CSV, or a CKAN server</li>
                   <li> Task Settings - configure all aspects of tasks, including scheduler, priority, and redundancy. You can also delete tasks.</li>
                  </ul>
              <li> Settings: edit the description of the project, select project category, allow anonymous contribution.</li>
            </ul>
            
            <b>STEP 7: Submit for publication</b><br> 
            When you are ready to go public, submit your project for publication.
            We will make sure your project adheres to our criteria, and get back to you within a few hours.



            </b-tab>

            <b-tab  title="Criteria">

              Anybody can create a project in the platform, as long it obeys to the following criteria:

              <ul style="list-style-type: square;margin-left:30px;margin-top:20px;">
              
                <li>The project’s topic and goals have clear scientific and/or social interest. </li>

                <li>The project objectives and desired outcomes are communicated in the project description in an accessible and comprehensible manner.  </li>

                <li>The objectives of the project are impossible – or very hard - to achieve without the contribution of the citizens.</li>

                <li>The project is open for all volunteer contributors to participate. </li>

                <li>An easy way to communicate with the project organizer is available for feedback and discussions.</li>

                <li>The content of the project does not facilitate illegal acts and does not cause offense to any audience (see terms and conditions for details).  </li>

                <li>The project’s goals (quantity of necessary data, coverage, required number of participants) are reasonable and achievable within a defined timeframe. </li>

                <li>Ethical aspects are considered (e.g. diversity, inclusion, gender equality) and permission of the UZH/ETH Ethical Commission is previously requested and obtained when necessary. </li>

                <li>Data generated by the project follows the EC principle "as open as possible, as closed as necessary", which focuses encouraging as few restrictions as possible, while at the same time protecting sensitive data from inappropriate access. </li>

                <li>The results of the project are published in an open-access format, provided there are no legitimate, legal, or ethical arguments against doing so.  </li>

              </ul>

            </b-tab>

          </b-tabs>

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
