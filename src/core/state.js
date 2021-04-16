import { observer } from "../observer"

export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    // computed ... watch
}
function initProps() {}
function initMethod() {}
function proxy(target,property,key){
    Object.defineProperty(target,key,{
        get(){
            return target[property][key];
        },
        set(newValue){
            target[property][key] = newValue
        }
    })
}
function initData(vm) {
  const options = vm.$options
  if (!options.data) return
  let data = options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  for(let key in data){
    proxy(vm,'_data',key);
  }
  observer(data)
}