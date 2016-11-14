require('normalize.css/normalize.css');
require('../styles/App.scss');
//require('../style/other.scss')
import React from 'react';
import ReactDOM from 'react-dom';


//获取Json并且添加imageURL属性
var imagesJson = require('../data/imageDatas.json');
var imagesJson=(function getImageUrl(imageArray) {
  var singleImage = {};
  for(let i=0;i<imageArray.length;i++){
    singleImage = imageArray[i];
    singleImage.imageURL = require('../images/' + singleImage.fileName);
    imageArray[i]=singleImage;

  }
  return imageArray

})(imagesJson);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
/*
 * 获取 0~30° 之间的一个任意正负值
 */
/*function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}*/
function get30DegRandom(){
  return ((Math.random() > 0.5 ? "" : '-') + Math.round(Math.random() * 30));
}

class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  //imgFigure点击的处理函数
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();

    }else {
      this.props.center();
    }


    e.stopPropagation();

    e.preventDefault();

  }
  render(){
    var styleObj={};
    //如果图片指定了这张图片的位置，则使用
    if(this.props.arrange.pos)
    {
      styleObj=this.props.arrange.pos;
    }
    //如果图片选择角度有值且不为0，添加
    if(this.props.arrange.rotate){
      (['MozTransform','WebkitTransform','msTransform','transform']).forEach(function (value) {
        styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this))
      /*styleObj['transform']='rotate('+this.props.arrange.rotate+'deg)'*/
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;

    }

    //如果是反面则添加类名is-inverse
    var imgFigureClassName='img-figure';
      imgFigureClassName+=this.props.arrange.isInverse? " is-inverse":'';
    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}
class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    if (this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    var controllerClassName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerClassName += ' is-center';
    }
    if (this.props.arrange.isInverse){
      controllerClassName += ' is-inverse';
    }
    return(
      <span className={controllerClassName} onClick={this.handleClick}></span>
    )
  }
}
class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      imgsArrangeArr: [
        /*{
         pos: {
         left: '0',
         top: '0'
         },
         rotate: 0,    // 旋转角度
         isInverse: false,    // 图片正反面
         isCenter: false,    // 图片是否居中
         }*/
      ]
    }
    this.inverse = this.inverse.bind(this);
    this.center = this.center.bind(this);
  }

  Constant={
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {   // 水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {    // 垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }
  /*
   *翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function}这是一个闭包函数，其内return一个真正待被执行的函数
   */
  inverse(index){
    return function () {
      var imgsArrangeArr=this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }.bind(this);
  }
  //参数centerIndex指定居中的图片,重新定位所有的图片
  rearrange(centerIndex) {

    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,

      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true,
      isInverse:false
    };

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false,
        isInverse:false
      };
    });

    // 布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      // 前半部分布局左边， 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false,
        isInverse:false
      };

    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });

  }
  /*
   *利用rearange函数，居中对应的index图片
   * @return {function}
   */
  center(index){
    return function () {
      this.rearrange(index)
    }.bind(this)
  }
  //组件加载过后，获取每张图片的其位置的范围
  componentDidMount(){
    var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
      halfStageW=Math.ceil(stageW/2),
      halfStageH=Math.ceil(stageH/2);
  //拿到ImgFigure的大小
    var ImgFigureDOM = ReactDOM.findDOMNode(this.refs.ImgFigure0),
      imgW = ImgFigureDOM.scrollWidth,
      imgH = ImgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH=Math.ceil(imgH/2);
    //计算中心图片的位置点
    this.Constant.centerPos={
      left: halfStageW-halfImgW,
      top:halfStageH-halfImgH
    }
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange();
  }
  render() {
    var controllerUnits = [];
    var imgFigures = [];
    //遍历图片json 加入节点
    imagesJson.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index]){
        //如果没有值就初始化
        this.state.imgsArrangeArr[index]={
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,
          isInverse:false,
          isCenter:false

        }
      }

      imgFigures.push(<ImgFigure data = {value}
                                 arrange={this.state.imgsArrangeArr[index]}
                                 key={'imgFigures'+index}
                                 ref={'ImgFigure'+index}
                                 inverse={this.inverse(index)}
                                 center={this.center(index)}

      />);
      controllerUnits.push(<ControllerUnit key={"controllerUnit"+index}
                                           arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)}
                                           center={this.center(index)}

      ></ControllerUnit>);

    }.bind(this));

    return (
      <section className="stage" ref='stage'>
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}
App.defaultProps = {

};
export default App;
