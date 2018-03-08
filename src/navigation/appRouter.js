import {TabNavigator, StackNavigator, DrawerNavigator} from 'react-navigation';
import EditorContainer from '../modules/editor/EditorContainer';
import PostDetailContainer from '../modules/postDetail/PostDetailContainer';
import PostListContainer from '../modules/postList/PostListContainer';
import * as React from "react";

export const Main = StackNavigator(
    {
        PostListContainer: {screen: PostListContainer},
        PostDetailContainer: {screen: PostDetailContainer},
        EditorContainer: {screen: EditorContainer},
    },
    {headerMode: 'none'}
);


