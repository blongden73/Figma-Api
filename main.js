'use strict'

const api = new Figma.Api({ personalAccessToken: '190555-098298b1-6f0a-4f3d-99f2-bb482727cb09' });

var nodesArr = [];

api.getFile('K5fY4VI6o0YYZY1wNIMJsF').then((file) => {
    // access file data
    // console.log(file);
    var doc = file.document;
    var child = doc.children[0];
    var artboards = child.children;
    var content;
    for(var i=0; i<artboards.length; i++) {
      var elements = artboards[i].children;

      var nodes = elements;
      for(var j=0; j<nodes.length; j++){
        ///////TEXT ONLY ARTBOARDS/////////
        if(nodes[j].type === "TEXT") {
          //get props
          var fontSize = nodes[j].styles;
          content = nodes[j].name;
        } else if( nodes[j].type === "ELLIPSE" ){

          //get props
          var bounding = nodes[j].absoluteBoundingBox;
          var height = bounding.height + 'px';
          var width = bounding.width + 'px';
          var x = bounding.x;
          var y = bounding.y;
          var fill = nodes[j].fills[0].color;
          var rgba = 'rgba(' + fill.r + ',' + fill.g + ',' + fill.b + ',' + fill.a + ')';
          console.log('COLOR', fill);

          //set styles
          var styles = 'background-color:'+ rgba +';'  + 'width:' + width + ';' + 'height:' + height + ';';
          content = '<span style="'+ styles +'" class="circle"></span>';

        } else {
          var fill = nodes[j].fills;
          console.log(fill);
          if(fill[0].type === "IMAGE"){
            var imageRef = fill[0].imageRef;
            content = '<img data-image="'+ imageRef + '">';
          }else {
            content = "there is something else here"
          }
        }

        //Render the HTML in the page
        nodesArr.push('<div class="'+ nodes[j].type +'">'+ content +'</div>');
        console.log(nodesArr);
        var rawHTML = nodesArr.join('');
        var insertIntoFile = rawHTML;
        var placeholder = document.querySelector('.figma-cms-design-guide');
        placeholder.innerHTML = insertIntoFile;

        //After the page loads check if there are images and go and fetch them
        api.getImageFills('K5fY4VI6o0YYZY1wNIMJsF').then((response) => {
            console.log(response.meta.images);
            var images = document.querySelectorAll('img');
            console.log(images);
            for(var g=0; g<images.length; g++) {
              var ref = images[g].dataset.image;
              images[g].src = response.meta.images[ref];
            }
        });
      }
    }
});

// console.log(getImagesFromApi());
// // var content = getImagesFromApi();


console.log('hello');
