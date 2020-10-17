<template>
    <div>
        <div class="uk-card uk-card-body uk-card-bordered uk-box-shadow-medium uk-background-cover uk-height-large uk-position-relative" :data-src="thumbnail" uk-img>
            <div v-if="onBillboard" class="uk-position-top-right uk-padding-small">
                <span class="uk-label uk-label-warning uk-box-shadow-medium">On billboard</span>
            </div>
        </div>
        <h3 class="uk-margin-small-bottom uk-margin-small-top uk-text-bold">{{ title }}</h3>
        <p class="uk-margin-remove">{{ releaseDate }}</p>
    </div>
</template>

<script>
    export default {
        props: ["thumbnail","title","releaseDate","onBillboard"]
    };
</script>