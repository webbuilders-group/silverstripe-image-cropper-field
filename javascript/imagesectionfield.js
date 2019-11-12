(function($) {
  $.entwine(function($) {
    let changed = false;

    $(".image-selection").entwine({
      onmatch: function() {
        let target = this;
        //get the proper edit form so we can have multiple image selection fields
        let targetname = "#Form_EditForm_" + target.data("targetname");
        //get the olddata for the cropboxdata used in the ready function
        let data = $(targetname + " .fields input:nth-child(1)").val();
        data = data.split(",");

        target.cropper({
          //zoomable: false,
          responsive: false,
          minContainerWidth: 800,
          minContainerHeight: 500,
          crop: function(event) {
            //create the comma separated string
            let newData =
              Math.round(event.detail.x) +
              "," +
              Math.round(event.detail.y) +
              "," +
              Math.round(event.detail.width) +
              "," +
              Math.round(event.detail.height) +
              "," +
              target.cropper("getData").x +
              "," +
              target.cropper("getData").y +
              "," +
              target.cropper("getData").width +
              "," +
              target.cropper("getData").height;

            //update the cropboxdata field so we can use it when the page refreshes
            $(targetname + " .fields input:nth-child(1)").val(newData);

            //changed
            changed = true;
          },
          ready: function() {
            //set the start position of the cropper
            target.cropper("setData", {
              x: parseFloat(data[4]),
              y: parseFloat(data[5]),
              width: parseFloat(data[6]),
              height: parseFloat(data[7]),
            });

            //not changed
            changed = false;
          },
        });

        this._super();
      },
    });

    $(".imageselectionfield-move-tool").entwine({
      onclick: function(e) {
        //get the proper edit form so we can have multiple image selection fields
        let target = this.parent()
          .parent()
          .find(".image-selection");

        //toggle move mode
        target.cropper("setDragMode", "move");

        //update the active icon
        $(this)
          .parent()
          .parent()
          .find(".imageselectionfield-toolbar > span")
          .each(function() {
            $(this).removeClass("active");
          });

        $(this).addClass("active");

        this._super();
      },
    });

    $(".imageselectionfield-selection-tool").entwine({
      onclick: function(e) {
        //get the proper edit form so we can have multiple image selection fields
        let target = this.parent()
          .parent()
          .find(".image-selection");

        //toggle crop mode
        target.cropper("setDragMode", "crop");

        //update the active icon
        $(this)
          .parent()
          .parent()
          .find(".imageselectionfield-toolbar > span")
          .each(function() {
            $(this).removeClass("active");
          });

        $(this).addClass("active");

        this._super();
      },
    });

    $(".imageselectionfield-zoomin-tool").entwine({
      onclick: function(e) {
        //get the proper edit form so we can have multiple image selection fields
        let target = this.parent()
          .parent()
          .find(".image-selection");

        //toggle crop mode
        target.cropper("zoom", "0.1");

        this._super();
      },
    });

    $(".imageselectionfield-zoomout-tool").entwine({
      onclick: function(e) {
        //get the proper edit form so we can have multiple image selection fields
        let target = this.parent()
          .parent()
          .find(".image-selection");

        //toggle crop mode
        target.cropper("zoom", "-0.1");

        this._super();
      },
    });

    $(".imageselectionfield-reset-tool").entwine({
      onclick: function(e) {
        //get the proper edit form so we can have multiple image selection fields
        let target = this.parent()
          .parent()
          .find(".image-selection");

        //toggle crop mode
        target.cropper("reset");

        this._super();
      },
    });

    $(".imageselectionfield-savecropped-tool").entwine({
      onclick: function(e) {
        //get the form
        const form = this.parents("form");
        let formUrl = form.attr("action");
        let url = `${encodeURI(formUrl)}/field/${this.parent()
          .parent()
          .attr("name")}/cropImage`;

        if (!changed) {
          window.location.href = url;
        } else {
          $("#Form_EditForm_error")
            .css("display", "block")
            .addClass("alert alert-warning")
            .html(
              "It is reccomended you save before attempting to create the cropped image."
            );
        }
      },
    });
  });
})(jQuery);
