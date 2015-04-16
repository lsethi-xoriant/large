Large.Views.NewStory = Backbone.View.extend({
  template: JST['stories/new_story'],
  header: JST['stories/_new_story_header'],
  insertToolbar: JST['stories/_insert_toolbar'],

  events: {
    "click #header-image": "addImage",
    "click #submit-confirm": "submitForm",
    "click #confirm": "autoSave",
    "keyup .editable": "addButton",
    "click .insert-pic": "insertPic",
    "click .insert-line": "insertLine",
    "click .editable": "showToolbar"
  },

  initialize: function (options) {
    this.collection = options.collection;
    this.publications = options.publications;
    this.listenTo(this.publications, 'sync', this.render);
  },

  render: function () {
    $('.navbar-nav').find('.new-story-header').remove();
    var headerContent = this.header({
      story: this.model,
      publications: this.publications
    });

    $('.navbar-nav').prepend(headerContent);
    this.$el.html(this.template({ story: this.model, publications: this.publications }));
    var editor = new MediumEditor('.editable', {
      placeholder: "",
      buttons: ['bold', 'italic', 'header1', 'header2', 'header3', 'justifyCenter', 'quote', 'anchor']
    });

    $('.editable p').before(this.insertToolbar())

    return this;
  },

  addButton: function (event) {
    var tb = this.insertToolbar();
    event.preventDefault();
    if (event.keyCode === 13) {
      $(event.target).children().each( function () {
        $(this).children().each( function () {
          if ($(this).is('p') && !$(this).prev().is('.insert-toolbar')) {
            $(this).before(tb);
          }
        })
      })
    }
  },

  addImage: function () {
    filepicker.setKey("AFA8IlPkxSNC1BPrgoHtsz");

    filepicker.pick(
      {
        mimetypes:'image/*',
        services:'COMPUTER'
      },
      function (Blob) {
        var image = Blob.url;
        this.model.set("header_image", image);
        this.$('.image').html("<img src='" + image + "'>");
      }.bind(this)
    )
  },

  showToolbar: function (event) {
    p = window.getSelection().focusNode

    $('p').each( function () {
      if (this !== p) {
        $(this).prev().css('opacity', 0);
        $(this).prev().css('z-index', -1000);
        $(this).css('opacity', 1);
      } else {
        $(this).prev().css('opacity', 1);
        $(this).prev().css('z-index', 1000);
        $(this).css('opacity', 0);
      }
    })
  },

  insertPic: function (event) {
    var $para = $(event.currentTarget).parent().parent().next();

    filepicker.setKey("AFA8IlPkxSNC1BPrgoHtsz");
    filepicker.pick(
      {
        mimetypes:'image/*',
        services:'COMPUTER'
      },
      function (Blob) {
        var image = Blob.url;
        console.log(image);
        $para.html("<img style='max-width:400px' src='" + image + "'>");
      }.bind(this)
    )
  },

  insertLine: function (event) {

  },

  autoSave: function (event) {
    event.preventDefault();

    $('.insert-toolbar').remove();
    this.model.set("body", this.$('.editable').html());

    this.model.save(this.model.attributes, {
      success: function () {
        this.collection.add(this.model, { merge: true });
        this.$('#modal-title').val(this.$('#title').text());
        this.$('#modal-subtitle').val(this.$('#subtitle').text());
      }.bind(this)
    });

  },

  submitForm: function (event) {
    event.preventDefault();
    var formData = this.$('.confirm-form').serializeJSON();
    this.model.save(formData.story, {
      success: function () {
        Backbone.history.navigate("stories/" + this.model.id, { trigger: true })
      }.bind(this)
    })
  }
});
