import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JSDOM } from 'jsdom';

Enzyme.configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter((prop) => typeof target[prop] === 'undefined')
        .map((prop) => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.navigator = {
    userAgent: 'node.js',
};
copyProps(window, global);
