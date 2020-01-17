# react-usereducer-usecontext-example

子コンポーネントの無駄な再レンダリングを避けるために`useReducer`とコンテキストを利用する例。

reducerを使わず`useState`と`useCallback`したハンドラーをコンテキストに渡すことでも同等の処理を実現可能だが、コンテキストに操作が複数あるとそれぞれに`useCallback`する必要がありコードが長くなるのでreducerの方が結果としてすっきりすると思われるので、基本的に`useReducer`を使う方が良さそう。

注意点として、`useReducer`が返す`dispatch`は一意であることが保証されているが、`Context.Provider`に渡す`value`に`dispatch`以外も含める場合には`useMemo`でメモ化しておく必要がある。

React Developer Toolsの`Highlight updates when components render.`を有効にすると再レンダリングの様子がよくわかる。

