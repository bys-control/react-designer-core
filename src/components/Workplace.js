import React from 'react';
import BindToMixin from 'react-binding';
import _ from 'lodash';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import { DragDropContext } from 'react-dnd';
import {CSSTranshand} from 'transhand';
import Container from './../workplace/Container';

var defaultTransform = {
    tx: 0, ty: 0,     //translate in px
    sx: 1, sy: 1,     //scale
    rz: 0,            //rotation in radian
    ox: 0.5, oy: 0.5 //transform origin
};
var Workplace = React.createClass({
    mixins: [BindToMixin],
    getInitialState(){
        return {data:_.cloneDeep(this.props.schema.props.defaultData) || {}};
    },

    handleChange (change){
        var currentNode = this.props.current.node;
        if (currentNode == undefined) return;

        var style = currentNode.style;
        if (style === undefined) return;

        //resolution strategy -> defaultTransform -> style.transform -> change
        var transform = _.merge(_.merge(_.clone(defaultTransform),style.transform),change);

        //apply to current DOM node
        //this.state.currentNode.style.transform = this.generateCssTransform(transform);
        //this.state.currentNode.style.transformOrigin = `${transform.ox*100}% ${transform.oy*100}%`;

        var updated = currentNode.set('style',_.extend(_.clone(style),{'transform':transform}));
        this.props.currentChanged(updated);
    },
    componentWillReceiveProps: function (newProps) {
        var defaultData = this.props.schema.props && this.props.schema.props.defaultData;
        var newDefautData = newProps.schema.props && newProps.schema.props.defaultData;

        if (defaultData !== newDefautData) {
            this.setState({data: _.cloneDeep(newDefautData)});
        }
    },
    currentChanged(node,domEl){
        this.setState({currentDOMNode: domEl});
        if (this.props.currentChanged !== undefined) this.props.currentChanged(node);
    },
    render: function () {
        var handleClick = function () {
            if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.schema);
        }.bind(this);

        var dataContext = this.bindToState('data');

        var style = this.props.current.node.style || {};
        var transform = _.merge(_.clone(defaultTransform),style.transform);

        var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
        var customStyles = ctx['styles'] || {};
        var code = ctx['code'] && ctx['code'].code;
        var customCode = !!code? new Function(code)():undefined;

        var context = {
            styles:customStyles,
            customCode:customCode
        };

        var bgStyle = {};
        var bg = (this.props.schema.props && this.props.schema.props.background) || {};
        if (!!bg.color) bgStyle.backgroundColor = bg.color;
        if (!!bg.image) bgStyle.backgroundImage = 'url(' + bg.image + ')';
        if (!!bg.position) bgStyle.backgroundPosition = bg.position;
        if (!!bg.repeat) bgStyle.backgroundRepeat = bg.repeat;
        if (!!bg.attachment) bgStyle.backgroundAttachment = bg.attachment;

        var filter = bg.filter || {};
        var cssFilter = "";
        if (!!filter.blur) cssFilter += ' blur(' +  filter.blur +  'px)';
        if (!!filter.brightness) cssFilter += ' brightness(' +  filter.brightness +  '%)';
        if (!!filter.contrast) cssFilter += ' contrast(' +  filter.contrast +  '%)';
        if (!!filter.grayscale) cssFilter += ' grayscale(' +  filter.grayscale +  '%)';
        if (!!filter.hueRotate) cssFilter += ' hue-rotate(' +  filter.hueRotate +  'deg)';
        if (!!filter.invert) cssFilter += ' invert(' +  filter.invert +  '%)';
        if (!!filter.opacity) cssFilter += ' opacity(' +  filter.opacity +  '%)';
        if (!!filter.saturate) cssFilter += ' saturate(' +  filter.saturate +  '%)';
        if (!!filter.sepia) cssFilter += ' sepia(' +  filter.sepia +  '%)';

        bgStyle.WebkitFilter = cssFilter;
        bgStyle.filter = cssFilter;
        bgStyle.position = 'absolute';
        bgStyle.width = '100%';
        bgStyle.height = '100%';
        bgStyle.zIndex = -1;

        var component =
            <Container
                containers={this.props.schema.containers}
                boxes={this.props.schema.boxes}
                currentChanged={this.currentChanged}
                current={this.props.current}
                handleClick={handleClick}
                isRoot={true}
                dataBinder={dataContext}
                ctx={context}
                widgets={this.props.widgets}
                />;

        return ( <div className="cWorkplace">
            <div style={bgStyle}></div>
            {component}
            {this.state.currentDOMNode!==undefined?<CSSTranshand  transform = {transform} deTarget = {this.state.currentDOMNode} onChange = {this.handleChange}/>:null}
        </div>);
    }
});

module.exports = DragDropContext(HTML5Backend)(Workplace);
