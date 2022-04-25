import React from 'react';
import Player from '@madzadev/audio-player';
import '@madzadev/audio-player/dist/index.css';
import {
  Layout,
  Menu,
  Breadcrumb,
  PageHeader,
  Typography,
  Row,
  Col,
  Input,
} from 'antd';
import axios from 'axios';

export interface Track {
  url: string;
  title: string;
  tags: Array<string>;
}

export interface Song {
  title: string;
  videoId: string;
  thumbnail: string;
  duration: string;
  tags: Array<string> | any;
}

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Paragraph } = Typography;
const tracks = [
  {
    url: '',
    title: '',
    tags: [],
  },
];
const url = process.env.URL || 'http://localhost:5000';
function App() {
  const [isSearch, setIsSearching] = React.useState(false);
  const [currentTracks, setCurrentTracks] = React.useState(tracks);
  const onSearch = async (song: string) => {
    setIsSearching(true);
    const { data: songs } = await axios.post<Song[]>(url + '/api/recommend', {
      song,
    });
    const newSongs = songs.map<any>((v) => {
      return {
        title: v.title,
        url: url + '/api/stream/' + v.videoId,
        tags: ['unknown'],
      };
    });
    setIsSearching(false);
    setCurrentTracks(newSongs);
  };
  return (
    <Layout className="layout">
      <Header>
        <Typography.Title
          level={2}
          style={{ color: 'white', marginTop: '10px' }}
        >
          Music Recommendation
        </Typography.Title>
      </Header>
      <Content style={{ padding: '0 50px', minHeight: '100vh' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <Row justify="center" gutter={32} align="middle">
          <Col xs={24} sm={8} md={10} xxl={6}>
            <Paragraph>
              Type a song that you likes most in the input box below, then get
              your recommended 5 songs
            </Paragraph>
            <Search
              placeholder="Input your song name"
              enterButton="Search"
              size="large"
              loading={isSearch}
              onSearch={onSearch}
            />
          </Col>
          <Col xs={24} sm={16} md={12} xxl={6}>
            <Player
              trackList={currentTracks}
              includeTags={false}
              includeSearch={false}
              showPlaylist={true}
              autoPlayNextTrack={true}
            />
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created By Shiwei</Footer>
    </Layout>
  );
}

export default App;
