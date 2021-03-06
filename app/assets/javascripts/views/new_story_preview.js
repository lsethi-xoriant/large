Large.Views.NewStoryPreview = Backbone.View.extend({
  template: JST['stories/new_story_preview'],
  insertToolbar: JST['stories/_insert_toolbar'],

  events: {
    "click .expand": "expand",
    "click .publish": "createStory",
    "keyup .editable": "addButton",
    "click .insert-pic": "insertPic",
    "click .insert-line": "insertLine",
    "click .editable": "showToolbar",
    "click .new-insert": "showHiddenButtons",
    "click .closer": "refocus"
  },

  initialize: function (options) {
    this.parent = options.parent;
    this.publications = options.publications;
    this.collection = options.collection;
    this.ttags = options.ttags;

    this.listenTo(this.ttags, 'sync', this.render);
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function () {
    this.$el.html(this.template({ story: this.model, publications: this.publications }));
    this.$('.editable p').before(this.insertToolbar())
    $('.expand').tooltip({
      placement: 'top',
      trigger: 'hover'
    });

    $('p').tooltip({
      placement: 'bottom',
      trigger: 'manual'
    });
    return this;
  },

  addButton: function (event) {
    var tb = this.insertToolbar();
    event.preventDefault();
    if (event.keyCode === 13) {
      $(event.target).children().each( function () {
        if ($(this).is('p') && !$(this).prev().is('.insert-toolbar')) {
          $(this).before(tb);
        }
      });
    }

    if ($('p').text().length < 3) {
      $('p').tooltip('show');
      setTimeout(function () {
        $('p').tooltip('destroy');
      }, 2500);
    }
  },

  showToolbar: function (event) {
    p = window.getSelection().focusNode
    $('p').each( function () {
      if ((this !== p) && $(this).prev().is('.insert-toolbar')) {
        $(this).prev().css('opacity', 0);
        $(this).prev().css('z-index', -1000);
        $(this).css('opacity', 1);
      } else {
        $(this).prev().first().css('opacity', 1);
        $(this).prev().first().css('z-index', 1000);
      }
    })
  },

  showHiddenButtons: function (event) {
    var buttons = $(event.currentTarget).parent().find('.hidden-buttons');
    if ($(buttons).css('visibility') == 'visible') {
      $(buttons).css('visibility', 'hidden')
    } else {
      $(buttons).css('visibility', 'visible')
    }
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
    var $para = $(event.currentTarget).parent().parent().next();
    $para.html("<div style='width:100%'><hr noshade size=1 width='33%'><br></div>");
  },

  createStory: function (event) {
    event.preventDefault();

    if ($('p').text() === "") {
      $('#blankStoryError').modal('show');
      setTimeout( function () {
        $('#blankStoryError').modal('hide');
      }, 2000)
    } else {
      $('.insert-toolbar').remove();
      this.model.set("title", $($('p')[0]).text());
      this.model.set("subtitle", $($('p')[1]).text());
      this.model.set("body", this.$('.editable').html());

      this.model.save(this.model.attributes, {
        success: function () {
          this.collection.add(this.model, { merge: true });
          Backbone.history.navigate("stories/" + this.model.id, { trigger: true })
        }.bind(this)
      });
    }
  },

  expand: function () {
    this.model.set("body", this.$('.editable').html());

    var storyNew = new Large.Views.NewStory({
      collection: this.collection,
      model: this.model,
      publications: Large.Collections.publications,
      ttags: this.ttags
    });
    this.parent.remove();
    $('#content').html(storyNew.$el);
    storyNew.render();
  },

  refocus: function () {
    $('.editable').focus();
  }

});
