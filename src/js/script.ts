import jQuery from 'jQuery';
import mustache from 'mustache';

jQuery(document).ready(function($: any) {
  $.getJSON('dist/assets/data.json', () => {}).done((data: any) => {
    const template = $('#template').html();
    const showTemplate = mustache.render(template, data);
    $('#gallery').replaceWith(showTemplate);
  });
});
