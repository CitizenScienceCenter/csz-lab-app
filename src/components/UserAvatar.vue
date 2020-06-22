<template>
    <router-link tag="button" to="/profile" class="button button-user" :style="{'background-color':color}">
        {{ letter }}
    </router-link>
</template>

<script>
    export default {
        name: "UserAvatar",
        data() {
          return {
              greyHex: '7b7979'
          }
        },
        props: {
            username: {
                type: String,
                default: '?'
            }
        },
        computed: {
            letter() {
                if( this.username.substring(0,5) !== '_anon') {
                    return this.username.substring(0,1);
                }
                else {
                    return '';
                }
            },
            color() {

                var stringToColour = function (str) {
                    var hash = 0;
                    for (var i = 0; i < str.length; i++) {
                        hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    var colour = '#';
                    for (var i = 0; i < 3; i++) {
                        var value = (hash >> (i * 8)) & 0xFF;
                        colour += ('00' + value.toString(16)).substr(-2);
                    }
                    return colour;
                }
                var mix = function (color_1, color_2, weight) {
                    function d2h(d) {
                        return d.toString(16);
                    }  // convert a decimal value to hex
                    function h2d(h) {
                        return parseInt(h, 16);
                    } // convert a hex value to decimal

                    weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

                    var color = "#";

                    for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
                        var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
                            v2 = h2d(color_2.substr(i, 2)),

                            // combine the current pairs from each source color, according to the specified weight
                            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

                        while (val.length < 2) {
                            val = '0' + val;
                        } // prepend a '0' if val results in a single digit

                        color += val; // concatenate val to our new color string
                    }

                    return color; // PROFIT!
                };

                var colorString = stringToColour(this.username);
                colorString = colorString.substr(colorString.length - 6);

                var color = mix(colorString, this.greyHex, 25);

                return color;

            }
        }
    }
</script>

<style scoped>

</style>
