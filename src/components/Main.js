require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

var imagesJson=require('../data/imageDatas.json')
var imagesJsonUrl=(function getImagesUrl(imagesJson) {
  //将图片名生成图片的URL
  for(let i=0;i<imagesJson.length;i++){
    var singleImage = imagesJson[i];
    singleImage.imageUrl = require('../images/' + singleImage.filename);
    imagesJson=singleImage;
    return imagesJson;

  }
})(imagesJson);

// let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
