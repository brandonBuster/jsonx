import * as _jsonxChildren from './children';
import mochaJSDOM from 'jsdom-global';
import chai from 'chai';
import sinon from 'sinon';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'; // ES6
import ReactDOM from 'react-dom';
import ReactDOMElements from 'react-dom-factories';
import { expect, } from 'chai';
import { JSDOM, } from 'jsdom';
chai.use(require('sinon-chai'));
// import 'mocha-sinon';

const sampleJSONX = {
  component: 'div',
  props: {
    id: 'generatedJSONX',
    className:'jsonx',
  },
  children: [
    {
      component: 'p',
      props: {
        style: {
          color: 'red',
          fontWeight:'bold',
        },
      },
      children:'hello world',
    },
    {
      component: 'div',
      children: [
        {
          component: 'ul',
          children: [
            {
              component: 'li',
              children:'hey',
            },
            {
              component: 'li',
              children:'in',
            },
            {
              component: 'li',
              children:'list',
            },
          ],
        },
      ],
    },
  ],
};

const passableJSONX = {
  component: 'div',
  props: {
    title: 'this is passed',
    style: {
      color:'red',
    },
  },
  passprops: true,
  children: [
    {
      component: 'span',
      children:'should have props',
    },
    {
      component: 'p',
      props: {
        style: {
          color:'blue',
        },
      },
      children:'but no style',
    },
  ],
};

describe('jsonx', function () { 
  describe('getChildrenProperty', () => {
    const getChildrenProperty = _jsonxChildren.getChildrenProperty;
    it('should return the children of an JSONX Object', () => {
      const JSONXChildren = getChildrenProperty({ jsonx: sampleJSONX, });
      const JSONXChildrenPTag = getChildrenProperty({ jsonx: sampleJSONX.children[ 0 ], });
      expect(JSONXChildren).to.be.an('array');
      expect(JSONXChildren.length).to.eql(sampleJSONX.children.length);
      expect(JSONXChildrenPTag).to.be.a('string');
      expect(JSONXChildrenPTag).to.eql(sampleJSONX.children[ 0 ].children);
      expect(getChildrenProperty({
        jsonx: {
          props: { _children: {}, },
          children:'hello',
        },
      })).to.eql('hello');
      expect(getChildrenProperty({
        jsonx: {
        },
      })).to.eql(null);
      expect(getChildrenProperty({ props: { children: [1, 2, 3,], }, })).to.be.an('array');
      expect(getChildrenProperty({ jsonx:{ props: { children: 'hello', }, },  })).to.eql('hello');
    });
    it('should get the children from jsonx.props._children property', () => {
      const testJSONX = {
        component: 'div',
        props: {
          _children:'some text',
        },
      };
      const testJSONX2 = {
        component: 'div',
        props: {
          _children: [
            {
              component: 'p',
              children:'nested p tag',
            },
            {
              component: 'p',
              children:'nested p tag',
            },
          ],
        },
      };
      const testJSONX3 = {
        component: 'div',
        props: {
          _children: 'some text',
          children:'ignore this prop for children',
        },
        children:[
          {
            component: 'p',
            children:'should ignore nested p tag',
          },
          {
            component: 'p',
            children:'should ignore nested p tag',
          },
        ],
      };
      const JSONXChildren = getChildrenProperty({ jsonx: testJSONX, });
      const JSONXChildren2 = getChildrenProperty({ jsonx: testJSONX2, });
      const JSONXChildren3 = getChildrenProperty({ jsonx: testJSONX3, });
      expect(JSONXChildren).to.be.a('string');
      expect(JSONXChildren).to.eql(testJSONX.props._children);
      expect(JSONXChildren2).to.be.an('array');
      expect(JSONXChildren2.length).to.eql(testJSONX2.props._children.length);
      expect(JSONXChildren3).to.be.a('string');
      expect(JSONXChildren3).to.eql(testJSONX3.props._children);
    });
    it('should get the children from jsonx.props.children property', () => {
      const testJSONX = {
        component: 'div',
        props: {
          children:'some text',
        },
      };
      const testJSONX2 = {
        component: 'div',
        props: {
          children: [
            {
              component: 'p',
              children:'nested p tag',
            },
            {
              component: 'p',
              children:'nested p tag',
            },
          ],
        },
      };
      const testJSONX3 = {
        component: 'div',
        props: {
          children:'ignore this prop for children',
        },
        children:[
          {
            component: 'p',
            children:'should ignore nested p tag',
          },
          {
            component: 'p',
            children:'should ignore nested p tag',
          },
        ],
      };
      const testJSONX4 = {
        component: 'div',
        props: {
          children:()=>'not valid, should be null',
        },
      };
      const JSONXChildren = getChildrenProperty({ jsonx: testJSONX, });
      const JSONXChildren2 = getChildrenProperty({ jsonx: testJSONX2, });
      const JSONXChildren3 = getChildrenProperty({ jsonx: testJSONX3, });
      const JSONXChildren4 = getChildrenProperty({ jsonx: testJSONX4, });
      expect(JSONXChildren).to.be.a('string');
      expect(JSONXChildren).to.eql(testJSONX.props.children);
      expect(JSONXChildren2).to.be.an('array');
      expect(JSONXChildren2.length).to.eql(testJSONX2.props.children.length);
      expect(JSONXChildren3).to.be.a('array');
      expect(JSONXChildren3).to.eql(testJSONX3.children);
      expect(JSONXChildren4).to.be.a('function');
    });
  });
  describe('getChildrenProps', () => {
    const getChildrenProps = _jsonxChildren.getChildrenProps;
    const getChildrenProperty = _jsonxChildren.getChildrenProperty;
    it('should return child JSONX if not passing props', () => {
      const renderIndex = 1;
      const childjsonx = getChildrenProperty({ jsonx: sampleJSONX, })[0];
      const childProps = getChildrenProps({ jsonx: sampleJSONX, childjsonx, renderIndex, });
      expect(childProps).to.eq(childjsonx);
    });
    it('should pass props except for styles', () => {
      const renderIndex = 1;
      const childjsonx_span = getChildrenProperty({ jsonx: passableJSONX, })[0];
      const childjsonx_p = getChildrenProperty({ jsonx: passableJSONX, })[1];
      const childProps_span = getChildrenProps({ jsonx: passableJSONX, childjsonx:childjsonx_span, renderIndex, });
      const childProps_p = getChildrenProps({ jsonx: passableJSONX, childjsonx:childjsonx_p, renderIndex, });
      expect(childProps_span.props.title).to.eq(passableJSONX.props.title);
      expect(childProps_p.props.title).to.eq(passableJSONX.props.title);
      //@ts-ignore
      expect(childProps_p.props.style.color).to.eq(passableJSONX.children[ 1 ].props.style.color);
      expect(childProps_p.props.key).to.not.eq(renderIndex);
      expect(childProps_span.props.key).to.not.eq(renderIndex);
    });
  });
  describe('getJSONXChildren', () => {
    const getJSONXChildren = _jsonxChildren.getJSONXChildren;
    it('should return JSONX Child Objects', () => {
      const renderIndex = 1;
      const JSONXChildren = getJSONXChildren.call({}, {
        jsonx: passableJSONX,
        renderIndex,
      });
      //@ts-ignore
      JSONXChildren.forEach(ReactiveJSON => {
        expect(ReactiveJSON).to.be.an('object');
        expect(ReactiveJSON).to.haveOwnProperty('$$typeof');
        expect(ReactiveJSON).to.haveOwnProperty('type');
        expect(ReactiveJSON).to.haveOwnProperty('key');
        expect(ReactiveJSON).to.haveOwnProperty('ref');
        expect(ReactiveJSON).to.haveOwnProperty('props');
      });
    });
    it('should return null on error', () => {
      expect(getJSONXChildren({ logError: () => { }, })).to.eql(null);

    });
  });
});