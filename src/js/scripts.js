global.jQuery = require('jQuery');
const bootstrap = require('bootstrap');
const mustache = require('mustache');

jQuery(document).ready(function($) {
  $.getJSON('dist/assets/data.json', () => {}).done(data => {
    const template = $('#template').html();
    const showTemplate = mustache.render(template, data);
    $('#gallery').replaceWith(showTemplate);
  });
});
