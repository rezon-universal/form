export default function (Vue) {
    Vue.directive('click-outside', {
        bind: function (el, binding, vnode) {
            el.event = function (event) {
                if (!(el === event.target || el.contains(event.target))) {
                    vnode.context[binding.expression](event);
                }
            };
            window.addEventListener('mousedown', el.event);
        },
        unbind: function (el) {
            window.removeEventListener('mousedown', el.event);
        }
    });
}
