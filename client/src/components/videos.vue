<template>
  <div>

    <ul class="list-unstyled">
        <div v-for='video in videos' :key="video.title">
          <a :href='video.url'>
            <li class="media my-4">
              <img class="mr-3" :src="video.snippet.thumbnails.medium.url" alt="Thumbnail">
              <div class="media-body">
                <h5 class="mt-0 mb-1">{{video.snippet.title}}</h5>
                {{video.snippet.description}}
                <br />
              </div>
            </li>
            </a>
        </div>
      </ul>

  </div>
</template>

<script>
export default {
  props: ['videos']
}
</script>

