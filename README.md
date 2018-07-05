Prevent unnecessary wasted render of React component.

Before you continue, please read about wasted render [here](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation) and PureComponent [here](https://reactjs.org/docs/react-api.html#reactpurecomponent).

## Compor

Sometimes using PureComponent is not enough. Consider this example.

```jsx
<MyComponent
  title={this.state.title}
  style={[ styles.big, styles.red ]}
  onPress={() => this.props.navigation.navigate('Home')}
/>
```

In this example the component will always be rerendered even when the props are actually _doesn't change_ (wasted render) because it always creates new `style` and `onPress` object. One way to prevent this is to store style array and onPress function in global/module scoped or class scoped variable. I personally doesn't prefer this because sometimes inline things are supposed to be written _inlinely_ like in above example. Also, I don't like the idea of polluting class member with unnecessary variables.

That's why I made Compor, to provide another way to prevent rerender while it's still possible to write things _inlinely_.

```jsx
import Compor from 'compor';

<Compor ctype={MyComponent}
  title={this.state.title}
  keep_style={[ styles.big, styles.red ]}
  keep_onPress={() => this.props.navigation.navigate('Home')}
/>
```

`render` result of above code is the component we see in previous code: an element with component type of `MyComponent` with props `title`, `style`, and `onPress` (props `ctype` is not included and `keep_` prefix is removed).

Compor prevents wasted render because it implements `shouldComponentUpdate` like PureComponent. The difference with PureComponent's `shouldComponentUpdate` is that Compor's `shouldComponentUpdate` doesn't check props with name starts with `keep_`. They will be considered as not changed thus recreating object in these props won't cause rerender. Compor will be rerendered only if any props besides `keep_*` props is changed. In above code, only `ctype` and `title` can cause rerender.

Children, unfortunately, is also a prop that will be checked in `shouldComponentUpdate` and it is always be recreated. To "keep" children, Compor accept children of type function. If the children is a function, Compor will not check it in `shouldComponentUpdate`.

```jsx
import Compor from 'compor';

<Compor ctype={MyComponent}
  title={this.state.title}
  keep_style={[ styles.big, styles.red ]}
  keep_onPress={() => this.props.navigation.navigate('Home')}
>
  {() => (
    <div>I won't be wasted-rendered</div>
  )}
</Compor>
```

## More

### What if the children is more than one component?

In that case, you can use nothing. Yes, nothing, like `const Nothing = props => props.children;`. For people's convenience, Nothing is included in Compor.

```jsx
import Compor, { Nothing } from 'compor';

<Compor ctype={MyComponent}
  title={this.state.title}
  keep_style={[ styles.big, styles.red ]}
  keep_onPress={() => this.props.navigation.navigate('Home')}
>
  {() => (
    <Nothing>
      <div>I won't be wasted-rendered</div>
      <div>Hey I'm the other children!</div>
    </Nothing>
  )}
</Compor>
```

Since React v16.2.0 you can also use [empty tag](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html).

### But render is not expensive!

Okay okay, I know gearon [said](https://github.com/facebook/react/issues/8669#issuecomment-270113350) render is not expensive, but it is only if your render is not expensive! Render _can_ be expensive if you execute expensive things in render! Expensive equals expensive, unexpensive equals unexpensive!

To be fair, Compor is about preventing __wasted__ render, not __expensive__ render. Even if your render is dirt cheap, wasted is wasted, the price doesn't change that fact. Just consider it a bonus when Compor minimizes your expensive render.

### Is there any performance hit?

Hmmm, well, Compor's `shouldComponentUpdate` is practically almost the same as PureComponent so there's no significant hit here. And also, Compor's `render` is not doing that much. I think you should read the code yourself to answer this question. Biggest hit I felt is it makes the code slightly uglier.

### Can I extends from Compor?

Sure, nothing can stop you. Compor has `getRealProps` method to get the _real_ props for you.

```jsx
class MyComponent extends Compor {
  render() {
    const props = this.getRealProps();
    ...
  }
}
```

## Installation

This is a WIP and not in npm yet. I don't think I will publish it in npm because of how simple it is. So, you can install it by copying the files to your project.

## License

MIT
