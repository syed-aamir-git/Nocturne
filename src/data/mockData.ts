import type { Artist, Album, Playlist, Track } from '../types';

export const MOCK_TRACKS: Track[] = [
  {
    "id": "tr-1",
    "title": "Change (In the House of Flies)",
    "artist": "Deftones",
    "artistId": "art-1",
    "album": "White Pony",
    "albumId": "alb-1",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/a3/cd/86a3cd88-0036-3828-a67b-8174790c0355/mzaf_17335092681325376243.plus.aac.p.m4a",
    "duration": 300,
    "genre": "Alternative Metal",
    "releaseDate": "2000-06-20",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1852619,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Alternative Metal",
    "lyrics": "Echoes of Change (In the House of Flies) by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Deftones]"
      },
      {
        "time": 60,
        "text": "Change (In the House of Flies)"
      },
      {
        "time": 150,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 240,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:1",
    "originalSpotifyId": "tr-1"
  },
  {
    "id": "tr-2",
    "title": "Digital Bath",
    "artist": "Deftones",
    "artistId": "art-1",
    "album": "White Pony",
    "albumId": "alb-1",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a5/ed/0d/a5ed0dd4-6e69-2b37-7e68-99fcfe1c02ec/mzaf_11598198938780634860.plus.aac.p.m4a",
    "duration": 255,
    "genre": "Alternative Metal",
    "releaseDate": "2000-06-20",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 2045810,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Alternative Metal",
    "lyrics": "Echoes of Digital Bath by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Deftones]"
      },
      {
        "time": 51,
        "text": "Digital Bath"
      },
      {
        "time": 127,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 204,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:2",
    "originalSpotifyId": "tr-2"
  },
  {
    "id": "tr-3",
    "title": "Be Quiet and Drive (Far Away)",
    "artist": "Deftones",
    "artistId": "art-1",
    "album": "Around the Fur",
    "albumId": "alb-1b",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/27/cb/b4/27cbb40e-f8c6-dede-9c69-62089a873fa9/093624919803.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/27/cb/b4/27cbb40e-f8c6-dede-9c69-62089a873fa9/093624919803.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/82/8b/a2/828ba269-81af-dc56-d8a2-fa712a02dd02/mzaf_10134856389145791661.plus.aac.p.m4a",
    "duration": 308,
    "genre": "Alternative Metal",
    "releaseDate": "1997-10-28",
    "trackNumber": 3,
    "explicit": false,
    "playCount": 1858371,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Alternative Metal",
    "lyrics": "Echoes of Be Quiet and Drive (Far Away) by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Deftones]"
      },
      {
        "time": 61,
        "text": "Be Quiet and Drive (Far Away)"
      },
      {
        "time": 154,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 246,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:3",
    "originalSpotifyId": "tr-3"
  },
  {
    "id": "tr-4",
    "title": "Cherry Waves",
    "artist": "Deftones",
    "artistId": "art-1",
    "album": "Saturday Night Wrist",
    "albumId": "alb-1c",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/2e/12/19/2e121951-b104-af73-1952-93b3aaccabcf/093624919773.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/2e/12/19/2e121951-b104-af73-1952-93b3aaccabcf/093624919773.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/8f/e0/d98fe0da-427a-cb75-2970-1ffd0261f0c7/mzaf_4201452845307510018.plus.aac.p.m4a",
    "duration": 318,
    "genre": "Alternative Metal",
    "releaseDate": "2006-10-31",
    "trackNumber": 4,
    "explicit": false,
    "playCount": 2030873,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Alternative Metal",
    "lyrics": "Echoes of Cherry Waves by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Deftones]"
      },
      {
        "time": 63,
        "text": "Cherry Waves"
      },
      {
        "time": 159,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 254,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:4",
    "originalSpotifyId": "tr-4"
  },
  {
    "id": "tr-5",
    "title": "Pictures of You",
    "artist": "The Cure",
    "artistId": "art-2",
    "album": "Disintegration",
    "albumId": "alb-2",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/6d/a4/0d6da426-3f16-7450-c82c-9c35821680b7/mzaf_17899773850184689923.plus.aac.p.m4a",
    "duration": 288,
    "genre": "Gothic Rock",
    "releaseDate": "1990-03-19",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1729635,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Rock",
    "lyrics": "Echoes of Pictures of You by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: The Cure]"
      },
      {
        "time": 57,
        "text": "Pictures of You"
      },
      {
        "time": 144,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 230,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:5",
    "originalSpotifyId": "tr-5"
  },
  {
    "id": "tr-6",
    "title": "Lovesong",
    "artist": "The Cure",
    "artistId": "art-2",
    "album": "Disintegration",
    "albumId": "alb-2",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/d2/ba/94d2bacf-07d7-df79-24a3-7fbf5207c848/081227981303.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/d2/ba/94d2bacf-07d7-df79-24a3-7fbf5207c848/081227981303.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/11/14/191114b2-6e7f-6bf7-8dca-d0e5686dda12/mzaf_3779494718508004494.plus.aac.p.m4a",
    "duration": 210,
    "genre": "Gothic Rock",
    "releaseDate": "1989-05-02",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1528301,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Rock",
    "lyrics": "Echoes of Lovesong by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: The Cure]"
      },
      {
        "time": 42,
        "text": "Lovesong"
      },
      {
        "time": 105,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 168,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:6",
    "originalSpotifyId": "tr-6"
  },
  {
    "id": "tr-7",
    "title": "Fascination Street",
    "artist": "The Cure",
    "artistId": "art-2",
    "album": "Disintegration",
    "albumId": "alb-2",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/c9/1e/68c91efb-affe-3582-250d-f3c9cbea4db8/mzaf_6106529295729879688.plus.aac.p.m4a",
    "duration": 316,
    "genre": "Gothic Rock",
    "releaseDate": "1989-04-18",
    "trackNumber": 3,
    "explicit": false,
    "playCount": 1911464,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Rock",
    "lyrics": "Echoes of Fascination Street by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: The Cure]"
      },
      {
        "time": 63,
        "text": "Fascination Street"
      },
      {
        "time": 158,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 252,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:7",
    "originalSpotifyId": "tr-7"
  },
  {
    "id": "tr-8",
    "title": "Disintegration",
    "artist": "The Cure",
    "artistId": "art-2",
    "album": "Disintegration",
    "albumId": "alb-2",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0a/9c/1a/0a9c1a2a-6665-7979-2f1f-4cd788f82990/mzaf_3892039314805560137.plus.aac.p.m4a",
    "duration": 500,
    "genre": "Gothic Rock",
    "releaseDate": "1989-05-02",
    "trackNumber": 4,
    "explicit": false,
    "playCount": 1690073,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Rock",
    "lyrics": "Echoes of Disintegration by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: The Cure]"
      },
      {
        "time": 100,
        "text": "Disintegration"
      },
      {
        "time": 250,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 400,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:8",
    "originalSpotifyId": "tr-8"
  },
  {
    "id": "tr-9",
    "title": "Apocalypse",
    "artist": "Cigarettes After Sex",
    "artistId": "art-3",
    "album": "Cigarettes After Sex",
    "albumId": "alb-3",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b1/43/b0/b143b0ee-863a-8f7c-3c56-a67110ef1591/mzaf_10438092015459317290.plus.aac.p.m4a",
    "duration": 290,
    "genre": "Dream Pop",
    "releaseDate": "2017-03-20",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1555755,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Midnight Slowcore",
    "lyrics": "Echoes of Apocalypse by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Cigarettes After Sex]"
      },
      {
        "time": 58,
        "text": "Apocalypse"
      },
      {
        "time": 145,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 232,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:9",
    "originalSpotifyId": "tr-9"
  },
  {
    "id": "tr-10",
    "title": "K.",
    "artist": "Cigarettes After Sex",
    "artistId": "art-3",
    "album": "Cigarettes After Sex",
    "albumId": "alb-3",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/06/ec/9106ec5f-6dad-d8f8-0745-8e3ad98438bb/mzaf_10776239593810001655.plus.aac.p.m4a",
    "duration": 320,
    "genre": "Dream Pop",
    "releaseDate": "2016-12-01",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 2003793,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Midnight Slowcore",
    "lyrics": "Echoes of K. by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Cigarettes After Sex]"
      },
      {
        "time": 64,
        "text": "K."
      },
      {
        "time": 160,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 256,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:10",
    "originalSpotifyId": "tr-10"
  },
  {
    "id": "tr-11",
    "title": "Sunsetz",
    "artist": "Cigarettes After Sex",
    "artistId": "art-3",
    "album": "Cigarettes After Sex",
    "albumId": "alb-3",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/a4/4a/44a44a75-0576-12fa-6002-2f464c091102/mzaf_17923299166743083363.plus.aac.p.m4a",
    "duration": 215,
    "genre": "Dream Pop",
    "releaseDate": "2017-06-09",
    "trackNumber": 3,
    "explicit": false,
    "playCount": 1887925,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Midnight Slowcore",
    "lyrics": "Echoes of Sunsetz by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Cigarettes After Sex]"
      },
      {
        "time": 43,
        "text": "Sunsetz"
      },
      {
        "time": 107,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 172,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:11",
    "originalSpotifyId": "tr-11"
  },
  {
    "id": "tr-12",
    "title": "Sweet",
    "artist": "Cigarettes After Sex",
    "artistId": "art-3",
    "album": "Cigarettes After Sex",
    "albumId": "alb-3",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1f/56/4a/1f564a2c-ecbb-47ac-1aed-b171f48acfb8/mzaf_2289328977316131156.plus.aac.p.m4a",
    "duration": 292,
    "genre": "Dream Pop",
    "releaseDate": "2017-06-09",
    "trackNumber": 4,
    "explicit": false,
    "playCount": 1951252,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Midnight Slowcore",
    "lyrics": "Echoes of Sweet by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Cigarettes After Sex]"
      },
      {
        "time": 58,
        "text": "Sweet"
      },
      {
        "time": 146,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 233,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:12",
    "originalSpotifyId": "tr-12"
  },
  {
    "id": "tr-13",
    "title": "Karma Police",
    "artist": "Radiohead",
    "artistId": "art-4",
    "album": "OK Computer",
    "albumId": "alb-4",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a",
    "duration": 264,
    "genre": "Art Rock",
    "releaseDate": "1997-05-21",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1621264,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Art Rock",
    "lyrics": "Echoes of Karma Police by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Radiohead]"
      },
      {
        "time": 52,
        "text": "Karma Police"
      },
      {
        "time": 132,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 211,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:13",
    "originalSpotifyId": "tr-13"
  },
  {
    "id": "tr-14",
    "title": "Exit Music (For a Film)",
    "artist": "Radiohead",
    "artistId": "art-4",
    "album": "OK Computer",
    "albumId": "alb-4",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f9/12/e3/f912e3f3-41a6-28f7-251f-dffb260ff0a2/mzaf_563254257801619937.plus.aac.p.m4a",
    "duration": 267,
    "genre": "Art Rock",
    "releaseDate": "1997-05-21",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1662178,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Art Rock",
    "lyrics": "Echoes of Exit Music (For a Film) by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Radiohead]"
      },
      {
        "time": 53,
        "text": "Exit Music (For a Film)"
      },
      {
        "time": 133,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 213,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:14",
    "originalSpotifyId": "tr-14"
  },
  {
    "id": "tr-15",
    "title": "No Surprises",
    "artist": "Radiohead",
    "artistId": "art-4",
    "album": "OK Computer",
    "albumId": "alb-4",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/2a/fa/f02afaad-0a7f-9ceb-1236-55ef3d388061/mzaf_10063872040766906863.plus.aac.p.m4a",
    "duration": 229,
    "genre": "Art Rock",
    "releaseDate": "1997-05-21",
    "trackNumber": 3,
    "explicit": false,
    "playCount": 2280325,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Art Rock",
    "lyrics": "Echoes of No Surprises by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Radiohead]"
      },
      {
        "time": 45,
        "text": "No Surprises"
      },
      {
        "time": 114,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 183,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:15",
    "originalSpotifyId": "tr-15"
  },
  {
    "id": "tr-16",
    "title": "Street Spirit (Fade Out)",
    "artist": "Radiohead",
    "artistId": "art-4",
    "album": "The Bends",
    "albumId": "alb-4b",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1b/a9/5c/1ba95cac-b245-d386-63fb-6b857aa9dce8/634904078065.png/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1b/a9/5c/1ba95cac-b245-d386-63fb-6b857aa9dce8/634904078065.png/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/48/aa/31/48aa31f7-77d8-e958-a5ae-e53f18632b81/mzaf_10391342885850462327.plus.aac.p.m4a",
    "duration": 254,
    "genre": "Art Rock",
    "releaseDate": "1995-03-08",
    "trackNumber": 4,
    "explicit": false,
    "playCount": 2127096,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Art Rock",
    "lyrics": "Echoes of Street Spirit (Fade Out) by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Radiohead]"
      },
      {
        "time": 50,
        "text": "Street Spirit (Fade Out)"
      },
      {
        "time": 127,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 203,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:16",
    "originalSpotifyId": "tr-16"
  },
  {
    "id": "tr-17",
    "title": "Teardrop",
    "artist": "Massive Attack",
    "artistId": "art-5",
    "album": "Mezzanine",
    "albumId": "alb-5",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/a6/91/a3a691b0-8e49-399d-2585-ddcd6694c9f2/mzaf_16325826545413166648.plus.aac.p.m4a",
    "duration": 331,
    "genre": "Trip Hop",
    "releaseDate": "1998-04-20",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 2240415,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Dark Ambient Drone",
    "lyrics": "Echoes of Teardrop by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Massive Attack]"
      },
      {
        "time": 66,
        "text": "Teardrop"
      },
      {
        "time": 165,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 264,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:17",
    "originalSpotifyId": "tr-17"
  },
  {
    "id": "tr-18",
    "title": "Angel",
    "artist": "Massive Attack",
    "artistId": "art-5",
    "album": "Mezzanine",
    "albumId": "alb-5",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/db/af/6e/dbaf6e32-911f-be9d-e2b0-0e48189d14fe/mzaf_14963447783895938076.plus.aac.p.m4a",
    "duration": 380,
    "genre": "Trip Hop",
    "releaseDate": "1998-04-20",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1922139,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Dark Ambient Drone",
    "lyrics": "Echoes of Angel by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Massive Attack]"
      },
      {
        "time": 76,
        "text": "Angel"
      },
      {
        "time": 190,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 304,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:18",
    "originalSpotifyId": "tr-18"
  },
  {
    "id": "tr-19",
    "title": "Inertia Creeps",
    "artist": "Massive Attack",
    "artistId": "art-5",
    "album": "Mezzanine",
    "albumId": "alb-5",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4c/e9/da/4ce9da64-212a-e2e5-a672-b210d02d9fad/mzaf_11327992466087346448.plus.aac.p.m4a",
    "duration": 357,
    "genre": "Trip Hop",
    "releaseDate": "1998-04-20",
    "trackNumber": 3,
    "explicit": false,
    "playCount": 1707518,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Dark Ambient Drone",
    "lyrics": "Echoes of Inertia Creeps by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Massive Attack]"
      },
      {
        "time": 71,
        "text": "Inertia Creeps"
      },
      {
        "time": 178,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 285,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:19",
    "originalSpotifyId": "tr-19"
  },
  {
    "id": "tr-20",
    "title": "When the Sun Hits",
    "artist": "Slowdive",
    "artistId": "art-6",
    "album": "Souvlaki",
    "albumId": "alb-6",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8c/d6/29/8cd62943-9c69-3f1b-79b9-fad0883a0e9a/mzaf_9349941370226318512.plus.aac.p.m4a",
    "duration": 286,
    "genre": "Shoegaze",
    "releaseDate": "1993-05-17",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1514282,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Ethereal Dark Pop",
    "lyrics": "Echoes of When the Sun Hits by Slowdive.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Slowdive]"
      },
      {
        "time": 57,
        "text": "When the Sun Hits"
      },
      {
        "time": 143,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 228,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:20",
    "originalSpotifyId": "tr-20"
  },
  {
    "id": "tr-21",
    "title": "Alison",
    "artist": "Slowdive",
    "artistId": "art-6",
    "album": "Souvlaki",
    "albumId": "alb-6",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/9e/4f/1d9e4fa6-4efd-01d4-da8b-6778b096c6cb/mzaf_9036332438135022718.plus.aac.p.m4a",
    "duration": 231,
    "genre": "Shoegaze",
    "releaseDate": "1993-02-01",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1652006,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Ethereal Dark Pop",
    "lyrics": "Echoes of Alison by Slowdive.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Slowdive]"
      },
      {
        "time": 46,
        "text": "Alison"
      },
      {
        "time": 115,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 184,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:21",
    "originalSpotifyId": "tr-21"
  },
  {
    "id": "tr-22",
    "title": "Nightcall",
    "artist": "Kavinsky",
    "artistId": "art-7",
    "album": "OutRun",
    "albumId": "alb-7",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d2/45/fb/d245fbf9-8570-fdc0-5e6b-aa528c130486/mzaf_11947081694159530687.plus.aac.p.m4a",
    "duration": 258,
    "genre": "Synthwave",
    "releaseDate": "2010-03-26",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1538603,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Coldwave / EBM",
    "lyrics": "Echoes of Nightcall by Kavinsky.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Kavinsky]"
      },
      {
        "time": 51,
        "text": "Nightcall"
      },
      {
        "time": 129,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 206,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:22",
    "originalSpotifyId": "tr-22"
  },
  {
    "id": "tr-23",
    "title": "Pacific Coast Highway",
    "artist": "Kavinsky",
    "artistId": "art-7",
    "album": "OutRun",
    "albumId": "alb-7",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/c7/56/4dc75631-1430-4a38-01ac-4c29c0b56745/mzaf_13569774912078379964.plus.aac.p.m4a",
    "duration": 344,
    "genre": "Synthwave",
    "releaseDate": "2010-03-26",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1713363,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Coldwave / EBM",
    "lyrics": "Echoes of Pacific Coast Highway by Kavinsky.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Kavinsky]"
      },
      {
        "time": 68,
        "text": "Pacific Coast Highway"
      },
      {
        "time": 172,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 275,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:23",
    "originalSpotifyId": "tr-23"
  },
  {
    "id": "tr-24",
    "title": "Enjoy the Silence",
    "artist": "Depeche Mode",
    "artistId": "art-8",
    "album": "Violator",
    "albumId": "alb-8",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/ea/96/ebea965e-31b5-b75d-9e9b-260e35a7013c/mzaf_11893712329603215445.plus.aac.p.m4a",
    "duration": 258,
    "genre": "Synthpop",
    "releaseDate": "1990-01-01",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1798503,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Darkwave",
    "lyrics": "Echoes of Enjoy the Silence by Depeche Mode.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Depeche Mode]"
      },
      {
        "time": 51,
        "text": "Enjoy the Silence"
      },
      {
        "time": 129,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 206,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:24",
    "originalSpotifyId": "tr-24"
  },
  {
    "id": "tr-25",
    "title": "Policy of Truth",
    "artist": "Depeche Mode",
    "artistId": "art-8",
    "album": "Violator",
    "albumId": "alb-8",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5c/0e/66/5c0e66c0-d383-5641-3ec0-4bdb629c49ad/886445705119.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5c/0e/66/5c0e66c0-d383-5641-3ec0-4bdb629c49ad/886445705119.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f8/4b/7b/f84b7b23-3eb9-8d47-0013-13df6c524d8a/mzaf_9032172341357374796.plus.aac.p.m4a",
    "duration": 295,
    "genre": "Synthpop",
    "releaseDate": "1990-03-19",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1870143,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Darkwave",
    "lyrics": "Echoes of Policy of Truth by Depeche Mode.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Depeche Mode]"
      },
      {
        "time": 59,
        "text": "Policy of Truth"
      },
      {
        "time": 147,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 236,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:25",
    "originalSpotifyId": "tr-25"
  },
  {
    "id": "tr-26",
    "title": "Love Will Tear Us Apart",
    "artist": "Joy Division",
    "artistId": "art-9",
    "album": "Substance",
    "albumId": "alb-9",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/48/0e/d9480e26-29dc-ce6e-4a18-3b9bc220cb6a/mzaf_15907619936232897096.plus.aac.p.m4a",
    "duration": 206,
    "genre": "Post-Punk",
    "releaseDate": "1980-04-01",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 1575582,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Darkwave",
    "lyrics": "Echoes of Love Will Tear Us Apart by Joy Division.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Joy Division]"
      },
      {
        "time": 41,
        "text": "Love Will Tear Us Apart"
      },
      {
        "time": 103,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 164,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:26",
    "originalSpotifyId": "tr-26"
  },
  {
    "id": "tr-27",
    "title": "Disorder",
    "artist": "Joy Division",
    "artistId": "art-9",
    "album": "Unknown Pleasures",
    "albumId": "alb-9b",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Features114/v4/80/14/7f/80147fb9-8c62-8773-60fe-51d9bdcfd415/dj.blmthqrv.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features114/v4/80/14/7f/80147fb9-8c62-8773-60fe-51d9bdcfd415/dj.blmthqrv.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4d/cc/89/4dcc8922-012f-c11f-b061-caef7bafe7e2/mzaf_11167643022210339253.plus.aac.p.m4a",
    "duration": 209,
    "genre": "Post-Punk",
    "releaseDate": "1979-06-15",
    "trackNumber": 2,
    "explicit": false,
    "playCount": 1969853,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Darkwave",
    "lyrics": "Echoes of Disorder by Joy Division.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Joy Division]"
      },
      {
        "time": 41,
        "text": "Disorder"
      },
      {
        "time": 104,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 167,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:27",
    "originalSpotifyId": "tr-27"
  },
  {
    "id": "tr-28",
    "title": "Bela Lugosi's Dead",
    "artist": "Bauhaus",
    "artistId": "art-10",
    "album": "The Sky's Gone Out",
    "albumId": "alb-10",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
    "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/95/83/46/95834682-fe4d-c75c-60c3-2527f306d1bd/mzaf_16282298977821139714.plus.aac.p.m4a",
    "duration": 577,
    "genre": "Gothic Rock",
    "releaseDate": "2018-11-23",
    "trackNumber": 1,
    "explicit": false,
    "playCount": 2182913,
    "bitrate": "24-bit / 96kHz Master",
    "vibe": "Gothic Darkwave",
    "lyrics": "Echoes of Bela Lugosi's Dead by Bauhaus.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
    "syncedLyrics": [
      {
        "time": 0,
        "text": "[Intro: Bauhaus]"
      },
      {
        "time": 115,
        "text": "Bela Lugosi's Dead"
      },
      {
        "time": 288,
        "text": "Music for the hours that belong to you"
      },
      {
        "time": 461,
        "text": "[Outro - Harmonic fade]"
      }
    ],
    "originalSpotifyUri": "spotify:track:28",
    "originalSpotifyId": "tr-28"
  }
];

export const MOCK_ALBUMS: Album[] = [
  {
    "id": "alb-1",
    "title": "White Pony",
    "artist": "Deftones",
    "artistId": "art-1",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "releaseDate": "2000-06-20",
    "releaseYear": 2000,
    "genre": "Alternative Metal",
    "tracks": [
      {
        "id": "tr-1",
        "title": "Change (In the House of Flies)",
        "artist": "Deftones",
        "artistId": "art-1",
        "album": "White Pony",
        "albumId": "alb-1",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/a3/cd/86a3cd88-0036-3828-a67b-8174790c0355/mzaf_17335092681325376243.plus.aac.p.m4a",
        "duration": 300,
        "genre": "Alternative Metal",
        "releaseDate": "2000-06-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1852619,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Alternative Metal",
        "lyrics": "Echoes of Change (In the House of Flies) by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Deftones]"
          },
          {
            "time": 60,
            "text": "Change (In the House of Flies)"
          },
          {
            "time": 150,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 240,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:1",
        "originalSpotifyId": "tr-1"
      },
      {
        "id": "tr-2",
        "title": "Digital Bath",
        "artist": "Deftones",
        "artistId": "art-1",
        "album": "White Pony",
        "albumId": "alb-1",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a5/ed/0d/a5ed0dd4-6e69-2b37-7e68-99fcfe1c02ec/mzaf_11598198938780634860.plus.aac.p.m4a",
        "duration": 255,
        "genre": "Alternative Metal",
        "releaseDate": "2000-06-20",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 2045810,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Alternative Metal",
        "lyrics": "Echoes of Digital Bath by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Deftones]"
          },
          {
            "time": 51,
            "text": "Digital Bath"
          },
          {
            "time": 127,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 204,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:2",
        "originalSpotifyId": "tr-2"
      }
    ],
    "tracksCount": 2,
    "description": "Seminal atmospheric alternative rock and post-metal masterpiece featuring lush subterranean reverberations."
  },
  {
    "id": "alb-2",
    "title": "Disintegration",
    "artist": "The Cure",
    "artistId": "art-2",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
    "releaseDate": "1989-05-02",
    "releaseYear": 1989,
    "genre": "Gothic Rock",
    "tracks": [
      {
        "id": "tr-5",
        "title": "Pictures of You",
        "artist": "The Cure",
        "artistId": "art-2",
        "album": "Disintegration",
        "albumId": "alb-2",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/6d/a4/0d6da426-3f16-7450-c82c-9c35821680b7/mzaf_17899773850184689923.plus.aac.p.m4a",
        "duration": 288,
        "genre": "Gothic Rock",
        "releaseDate": "1990-03-19",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1729635,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Rock",
        "lyrics": "Echoes of Pictures of You by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: The Cure]"
          },
          {
            "time": 57,
            "text": "Pictures of You"
          },
          {
            "time": 144,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 230,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:5",
        "originalSpotifyId": "tr-5"
      },
      {
        "id": "tr-6",
        "title": "Lovesong",
        "artist": "The Cure",
        "artistId": "art-2",
        "album": "Disintegration",
        "albumId": "alb-2",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/d2/ba/94d2bacf-07d7-df79-24a3-7fbf5207c848/081227981303.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/d2/ba/94d2bacf-07d7-df79-24a3-7fbf5207c848/081227981303.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/11/14/191114b2-6e7f-6bf7-8dca-d0e5686dda12/mzaf_3779494718508004494.plus.aac.p.m4a",
        "duration": 210,
        "genre": "Gothic Rock",
        "releaseDate": "1989-05-02",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1528301,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Rock",
        "lyrics": "Echoes of Lovesong by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: The Cure]"
          },
          {
            "time": 42,
            "text": "Lovesong"
          },
          {
            "time": 105,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 168,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:6",
        "originalSpotifyId": "tr-6"
      },
      {
        "id": "tr-7",
        "title": "Fascination Street",
        "artist": "The Cure",
        "artistId": "art-2",
        "album": "Disintegration",
        "albumId": "alb-2",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/c9/1e/68c91efb-affe-3582-250d-f3c9cbea4db8/mzaf_6106529295729879688.plus.aac.p.m4a",
        "duration": 316,
        "genre": "Gothic Rock",
        "releaseDate": "1989-04-18",
        "trackNumber": 3,
        "explicit": false,
        "playCount": 1911464,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Rock",
        "lyrics": "Echoes of Fascination Street by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: The Cure]"
          },
          {
            "time": 63,
            "text": "Fascination Street"
          },
          {
            "time": 158,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 252,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:7",
        "originalSpotifyId": "tr-7"
      },
      {
        "id": "tr-8",
        "title": "Disintegration",
        "artist": "The Cure",
        "artistId": "art-2",
        "album": "Disintegration",
        "albumId": "alb-2",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/93/3c/2c/mzi.ujtdsknz.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0a/9c/1a/0a9c1a2a-6665-7979-2f1f-4cd788f82990/mzaf_3892039314805560137.plus.aac.p.m4a",
        "duration": 500,
        "genre": "Gothic Rock",
        "releaseDate": "1989-05-02",
        "trackNumber": 4,
        "explicit": false,
        "playCount": 1690073,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Rock",
        "lyrics": "Echoes of Disintegration by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: The Cure]"
          },
          {
            "time": 100,
            "text": "Disintegration"
          },
          {
            "time": 250,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 400,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:8",
        "originalSpotifyId": "tr-8"
      }
    ],
    "tracksCount": 4,
    "description": "The definitive gothic rock magnum opus with swirling choruses, deep basslines, and profound nocturnal romanticism."
  },
  {
    "id": "alb-3",
    "title": "Cigarettes After Sex",
    "artist": "Cigarettes After Sex",
    "artistId": "art-3",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "releaseDate": "2017-06-09",
    "releaseYear": 2017,
    "genre": "Dream Pop",
    "tracks": [
      {
        "id": "tr-9",
        "title": "Apocalypse",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b1/43/b0/b143b0ee-863a-8f7c-3c56-a67110ef1591/mzaf_10438092015459317290.plus.aac.p.m4a",
        "duration": 290,
        "genre": "Dream Pop",
        "releaseDate": "2017-03-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1555755,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of Apocalypse by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 58,
            "text": "Apocalypse"
          },
          {
            "time": 145,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 232,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:9",
        "originalSpotifyId": "tr-9"
      },
      {
        "id": "tr-10",
        "title": "K.",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/06/ec/9106ec5f-6dad-d8f8-0745-8e3ad98438bb/mzaf_10776239593810001655.plus.aac.p.m4a",
        "duration": 320,
        "genre": "Dream Pop",
        "releaseDate": "2016-12-01",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 2003793,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of K. by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 64,
            "text": "K."
          },
          {
            "time": 160,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 256,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:10",
        "originalSpotifyId": "tr-10"
      },
      {
        "id": "tr-11",
        "title": "Sunsetz",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/a4/4a/44a44a75-0576-12fa-6002-2f464c091102/mzaf_17923299166743083363.plus.aac.p.m4a",
        "duration": 215,
        "genre": "Dream Pop",
        "releaseDate": "2017-06-09",
        "trackNumber": 3,
        "explicit": false,
        "playCount": 1887925,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of Sunsetz by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 43,
            "text": "Sunsetz"
          },
          {
            "time": 107,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 172,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:11",
        "originalSpotifyId": "tr-11"
      },
      {
        "id": "tr-12",
        "title": "Sweet",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1f/56/4a/1f564a2c-ecbb-47ac-1aed-b171f48acfb8/mzaf_2289328977316131156.plus.aac.p.m4a",
        "duration": 292,
        "genre": "Dream Pop",
        "releaseDate": "2017-06-09",
        "trackNumber": 4,
        "explicit": false,
        "playCount": 1951252,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of Sweet by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 58,
            "text": "Sweet"
          },
          {
            "time": 146,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 233,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:12",
        "originalSpotifyId": "tr-12"
      }
    ],
    "tracksCount": 4,
    "description": "Intimate and hazy late-night slowcore, whispering guitars, and tender ambient memories."
  },
  {
    "id": "alb-4",
    "title": "OK Computer",
    "artist": "Radiohead",
    "artistId": "art-4",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "releaseDate": "1997-05-21",
    "releaseYear": 1997,
    "genre": "Art Rock",
    "tracks": [
      {
        "id": "tr-13",
        "title": "Karma Police",
        "artist": "Radiohead",
        "artistId": "art-4",
        "album": "OK Computer",
        "albumId": "alb-4",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a",
        "duration": 264,
        "genre": "Art Rock",
        "releaseDate": "1997-05-21",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1621264,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Art Rock",
        "lyrics": "Echoes of Karma Police by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Radiohead]"
          },
          {
            "time": 52,
            "text": "Karma Police"
          },
          {
            "time": 132,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 211,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:13",
        "originalSpotifyId": "tr-13"
      },
      {
        "id": "tr-14",
        "title": "Exit Music (For a Film)",
        "artist": "Radiohead",
        "artistId": "art-4",
        "album": "OK Computer",
        "albumId": "alb-4",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f9/12/e3/f912e3f3-41a6-28f7-251f-dffb260ff0a2/mzaf_563254257801619937.plus.aac.p.m4a",
        "duration": 267,
        "genre": "Art Rock",
        "releaseDate": "1997-05-21",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1662178,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Art Rock",
        "lyrics": "Echoes of Exit Music (For a Film) by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Radiohead]"
          },
          {
            "time": 53,
            "text": "Exit Music (For a Film)"
          },
          {
            "time": 133,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 213,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:14",
        "originalSpotifyId": "tr-14"
      },
      {
        "id": "tr-15",
        "title": "No Surprises",
        "artist": "Radiohead",
        "artistId": "art-4",
        "album": "OK Computer",
        "albumId": "alb-4",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/2a/fa/f02afaad-0a7f-9ceb-1236-55ef3d388061/mzaf_10063872040766906863.plus.aac.p.m4a",
        "duration": 229,
        "genre": "Art Rock",
        "releaseDate": "1997-05-21",
        "trackNumber": 3,
        "explicit": false,
        "playCount": 2280325,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Art Rock",
        "lyrics": "Echoes of No Surprises by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Radiohead]"
          },
          {
            "time": 45,
            "text": "No Surprises"
          },
          {
            "time": 114,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 183,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:15",
        "originalSpotifyId": "tr-15"
      }
    ],
    "tracksCount": 3,
    "description": "Towering dystopian art rock, acoustic isolation, and visionary electronic experimentation."
  },
  {
    "id": "alb-5",
    "title": "Mezzanine",
    "artist": "Massive Attack",
    "artistId": "art-5",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "releaseDate": "1998-04-20",
    "releaseYear": 1998,
    "genre": "Trip Hop",
    "tracks": [
      {
        "id": "tr-17",
        "title": "Teardrop",
        "artist": "Massive Attack",
        "artistId": "art-5",
        "album": "Mezzanine",
        "albumId": "alb-5",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/a6/91/a3a691b0-8e49-399d-2585-ddcd6694c9f2/mzaf_16325826545413166648.plus.aac.p.m4a",
        "duration": 331,
        "genre": "Trip Hop",
        "releaseDate": "1998-04-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 2240415,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Dark Ambient Drone",
        "lyrics": "Echoes of Teardrop by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Massive Attack]"
          },
          {
            "time": 66,
            "text": "Teardrop"
          },
          {
            "time": 165,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 264,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:17",
        "originalSpotifyId": "tr-17"
      },
      {
        "id": "tr-18",
        "title": "Angel",
        "artist": "Massive Attack",
        "artistId": "art-5",
        "album": "Mezzanine",
        "albumId": "alb-5",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/db/af/6e/dbaf6e32-911f-be9d-e2b0-0e48189d14fe/mzaf_14963447783895938076.plus.aac.p.m4a",
        "duration": 380,
        "genre": "Trip Hop",
        "releaseDate": "1998-04-20",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1922139,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Dark Ambient Drone",
        "lyrics": "Echoes of Angel by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Massive Attack]"
          },
          {
            "time": 76,
            "text": "Angel"
          },
          {
            "time": 190,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 304,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:18",
        "originalSpotifyId": "tr-18"
      },
      {
        "id": "tr-19",
        "title": "Inertia Creeps",
        "artist": "Massive Attack",
        "artistId": "art-5",
        "album": "Mezzanine",
        "albumId": "alb-5",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4c/e9/da/4ce9da64-212a-e2e5-a672-b210d02d9fad/mzaf_11327992466087346448.plus.aac.p.m4a",
        "duration": 357,
        "genre": "Trip Hop",
        "releaseDate": "1998-04-20",
        "trackNumber": 3,
        "explicit": false,
        "playCount": 1707518,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Dark Ambient Drone",
        "lyrics": "Echoes of Inertia Creeps by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Massive Attack]"
          },
          {
            "time": 71,
            "text": "Inertia Creeps"
          },
          {
            "time": 178,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 285,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:19",
        "originalSpotifyId": "tr-19"
      }
    ],
    "tracksCount": 3,
    "description": "Hypnotic, dark trip hop driven by heavy sub-bass pulses, distorted guitars, and claustrophobic reverbs."
  },
  {
    "id": "alb-6",
    "title": "Souvlaki",
    "artist": "Slowdive",
    "artistId": "art-6",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "releaseDate": "1993-05-17",
    "releaseYear": 1993,
    "genre": "Shoegaze",
    "tracks": [
      {
        "id": "tr-20",
        "title": "When the Sun Hits",
        "artist": "Slowdive",
        "artistId": "art-6",
        "album": "Souvlaki",
        "albumId": "alb-6",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8c/d6/29/8cd62943-9c69-3f1b-79b9-fad0883a0e9a/mzaf_9349941370226318512.plus.aac.p.m4a",
        "duration": 286,
        "genre": "Shoegaze",
        "releaseDate": "1993-05-17",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1514282,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Ethereal Dark Pop",
        "lyrics": "Echoes of When the Sun Hits by Slowdive.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Slowdive]"
          },
          {
            "time": 57,
            "text": "When the Sun Hits"
          },
          {
            "time": 143,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 228,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:20",
        "originalSpotifyId": "tr-20"
      },
      {
        "id": "tr-21",
        "title": "Alison",
        "artist": "Slowdive",
        "artistId": "art-6",
        "album": "Souvlaki",
        "albumId": "alb-6",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/9e/4f/1d9e4fa6-4efd-01d4-da8b-6778b096c6cb/mzaf_9036332438135022718.plus.aac.p.m4a",
        "duration": 231,
        "genre": "Shoegaze",
        "releaseDate": "1993-02-01",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1652006,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Ethereal Dark Pop",
        "lyrics": "Echoes of Alison by Slowdive.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Slowdive]"
          },
          {
            "time": 46,
            "text": "Alison"
          },
          {
            "time": 115,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 184,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:21",
        "originalSpotifyId": "tr-21"
      }
    ],
    "tracksCount": 2,
    "description": "A cathedral of shimmering delay, ambient textures, and cavernous guitar walls created for late-night solace."
  },
  {
    "id": "alb-7",
    "title": "OutRun",
    "artist": "Kavinsky",
    "artistId": "art-7",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "releaseDate": "2013-02-22",
    "releaseYear": 2013,
    "genre": "Synthwave",
    "tracks": [
      {
        "id": "tr-22",
        "title": "Nightcall",
        "artist": "Kavinsky",
        "artistId": "art-7",
        "album": "OutRun",
        "albumId": "alb-7",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d2/45/fb/d245fbf9-8570-fdc0-5e6b-aa528c130486/mzaf_11947081694159530687.plus.aac.p.m4a",
        "duration": 258,
        "genre": "Synthwave",
        "releaseDate": "2010-03-26",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1538603,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Coldwave / EBM",
        "lyrics": "Echoes of Nightcall by Kavinsky.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Kavinsky]"
          },
          {
            "time": 51,
            "text": "Nightcall"
          },
          {
            "time": 129,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 206,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:22",
        "originalSpotifyId": "tr-22"
      },
      {
        "id": "tr-23",
        "title": "Pacific Coast Highway",
        "artist": "Kavinsky",
        "artistId": "art-7",
        "album": "OutRun",
        "albumId": "alb-7",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/c7/56/4dc75631-1430-4a38-01ac-4c29c0b56745/mzaf_13569774912078379964.plus.aac.p.m4a",
        "duration": 344,
        "genre": "Synthwave",
        "releaseDate": "2010-03-26",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1713363,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Coldwave / EBM",
        "lyrics": "Echoes of Pacific Coast Highway by Kavinsky.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Kavinsky]"
          },
          {
            "time": 68,
            "text": "Pacific Coast Highway"
          },
          {
            "time": 172,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 275,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:23",
        "originalSpotifyId": "tr-23"
      }
    ],
    "tracksCount": 2,
    "description": "Pounding electro synthwave and cinematic driving soundscapes through foggy midnight highways."
  },
  {
    "id": "alb-8",
    "title": "Violator",
    "artist": "Depeche Mode",
    "artistId": "art-8",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
    "releaseDate": "1990-03-19",
    "releaseYear": 1990,
    "genre": "Synthpop",
    "tracks": [
      {
        "id": "tr-24",
        "title": "Enjoy the Silence",
        "artist": "Depeche Mode",
        "artistId": "art-8",
        "album": "Violator",
        "albumId": "alb-8",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/ea/96/ebea965e-31b5-b75d-9e9b-260e35a7013c/mzaf_11893712329603215445.plus.aac.p.m4a",
        "duration": 258,
        "genre": "Synthpop",
        "releaseDate": "1990-01-01",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1798503,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Darkwave",
        "lyrics": "Echoes of Enjoy the Silence by Depeche Mode.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Depeche Mode]"
          },
          {
            "time": 51,
            "text": "Enjoy the Silence"
          },
          {
            "time": 129,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 206,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:24",
        "originalSpotifyId": "tr-24"
      },
      {
        "id": "tr-25",
        "title": "Policy of Truth",
        "artist": "Depeche Mode",
        "artistId": "art-8",
        "album": "Violator",
        "albumId": "alb-8",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5c/0e/66/5c0e66c0-d383-5641-3ec0-4bdb629c49ad/886445705119.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5c/0e/66/5c0e66c0-d383-5641-3ec0-4bdb629c49ad/886445705119.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f8/4b/7b/f84b7b23-3eb9-8d47-0013-13df6c524d8a/mzaf_9032172341357374796.plus.aac.p.m4a",
        "duration": 295,
        "genre": "Synthpop",
        "releaseDate": "1990-03-19",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1870143,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Darkwave",
        "lyrics": "Echoes of Policy of Truth by Depeche Mode.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Depeche Mode]"
          },
          {
            "time": 59,
            "text": "Policy of Truth"
          },
          {
            "time": 147,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 236,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:25",
        "originalSpotifyId": "tr-25"
      }
    ],
    "tracksCount": 2,
    "description": "The pinnacle of electronic darkwave and synthpop, rich with analog devotion and subterranean tension."
  },
  {
    "id": "alb-9",
    "title": "Substance",
    "artist": "Joy Division",
    "artistId": "art-9",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
    "releaseDate": "1988-07-11",
    "releaseYear": 1988,
    "genre": "Post-Punk",
    "tracks": [
      {
        "id": "tr-26",
        "title": "Love Will Tear Us Apart",
        "artist": "Joy Division",
        "artistId": "art-9",
        "album": "Substance",
        "albumId": "alb-9",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/48/0e/d9480e26-29dc-ce6e-4a18-3b9bc220cb6a/mzaf_15907619936232897096.plus.aac.p.m4a",
        "duration": 206,
        "genre": "Post-Punk",
        "releaseDate": "1980-04-01",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1575582,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Darkwave",
        "lyrics": "Echoes of Love Will Tear Us Apart by Joy Division.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Joy Division]"
          },
          {
            "time": 41,
            "text": "Love Will Tear Us Apart"
          },
          {
            "time": 103,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 164,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:26",
        "originalSpotifyId": "tr-26"
      }
    ],
    "tracksCount": 1,
    "description": "Stark, brooding post-punk anthems that laid the foundation for modern gothic and dark alternative music."
  },
  {
    "id": "alb-10",
    "title": "The Sky's Gone Out",
    "artist": "Bauhaus",
    "artistId": "art-10",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
    "releaseDate": "1982-10-19",
    "releaseYear": 1982,
    "genre": "Gothic Rock",
    "tracks": [
      {
        "id": "tr-28",
        "title": "Bela Lugosi's Dead",
        "artist": "Bauhaus",
        "artistId": "art-10",
        "album": "The Sky's Gone Out",
        "albumId": "alb-10",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/95/83/46/95834682-fe4d-c75c-60c3-2527f306d1bd/mzaf_16282298977821139714.plus.aac.p.m4a",
        "duration": 577,
        "genre": "Gothic Rock",
        "releaseDate": "2018-11-23",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 2182913,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Darkwave",
        "lyrics": "Echoes of Bela Lugosi's Dead by Bauhaus.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Bauhaus]"
          },
          {
            "time": 115,
            "text": "Bela Lugosi's Dead"
          },
          {
            "time": 288,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 461,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:28",
        "originalSpotifyId": "tr-28"
      }
    ],
    "tracksCount": 1,
    "description": "Dark, theatrical vampire post-punk, jagged guitars, and deep, resonant vocals."
  }
];

export const MOCK_ARTISTS: Artist[] = [
  {
    "id": "art-1",
    "name": "Deftones",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "biography": "Pioneering alternative metal and atmospheric rock band formed in Sacramento, California. Renowned for their ethereal vocal textures, crushing baritone riffs, and nocturnal soundscapes.",
    "bio": "Pioneering alternative metal and atmospheric rock band formed in Sacramento, California.",
    "genres": [
      "Alternative Metal",
      "Art Rock",
      "Post-Metal"
    ],
    "albums": [
      "alb-1"
    ],
    "monthlyListeners": 14500000,
    "verified": true
  },
  {
    "id": "art-2",
    "name": "The Cure",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
    "biography": "Legendary English gothic rock and post-punk band led by Robert Smith. Defined the sonic architecture of dark romanticism, sweeping choruses, and melancholy late-night anthems.",
    "bio": "Legendary English gothic rock and post-punk band led by Robert Smith.",
    "genres": [
      "Gothic Rock",
      "Post-Punk",
      "New Wave"
    ],
    "albums": [
      "alb-2"
    ],
    "monthlyListeners": 18200000,
    "verified": true
  },
  {
    "id": "art-3",
    "name": "Cigarettes After Sex",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "biography": "American dream pop and slowcore collective created by Greg Gonzalez. Known for their whispered androgynous vocals, cinematic slow tempos, and intimate midnight reveries.",
    "bio": "American dream pop and slowcore collective created by Greg Gonzalez.",
    "genres": [
      "Dream Pop",
      "Slowcore",
      "Ambient Pop"
    ],
    "albums": [
      "alb-3"
    ],
    "monthlyListeners": 24800000,
    "verified": true
  },
  {
    "id": "art-4",
    "name": "Radiohead",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
    "biography": "Iconic English art rock band formed in Abingdon, Oxfordshire. Celebrated for groundbreaking atmospheric experimentation, electronic orchestration, and existential lyrical depth.",
    "bio": "Iconic English art rock band formed in Abingdon, Oxfordshire.",
    "genres": [
      "Art Rock",
      "Alternative Rock",
      "Electronic"
    ],
    "albums": [
      "alb-4"
    ],
    "monthlyListeners": 28400000,
    "verified": true
  },
  {
    "id": "art-5",
    "name": "Massive Attack",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "biography": "English musical group formed in Bristol, widely considered pioneers of the trip-hop genre. Blends hypnotic sub-bass drones, dark dub reverbs, and haunting vocal collaborations.",
    "bio": "English musical group formed in Bristol, pioneers of trip-hop.",
    "genres": [
      "Trip Hop",
      "Dark Ambient Drone",
      "Electronic"
    ],
    "albums": [
      "alb-5"
    ],
    "monthlyListeners": 8900000,
    "verified": true
  },
  {
    "id": "art-6",
    "name": "Slowdive",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
    "biography": "Seminal British shoegaze and dream pop band. Master architects of swirling delay-drenched guitars, ethereal vocal harmonies, and cavernous acoustic cathedrals.",
    "bio": "Seminal British shoegaze and dream pop band.",
    "genres": [
      "Shoegaze",
      "Dream Pop",
      "Ethereal Wave"
    ],
    "albums": [
      "alb-6"
    ],
    "monthlyListeners": 4200000,
    "verified": true
  },
  {
    "id": "art-7",
    "name": "Kavinsky",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
    "biography": "French house and synthwave producer whose cinematic analog synthesizers evoke 1980s nocturnal road thrillers and neon-drenched midnight highways.",
    "bio": "French house and synthwave producer of Nightcall.",
    "genres": [
      "Synthwave",
      "Coldwave / EBM",
      "Electro House"
    ],
    "albums": [
      "alb-7"
    ],
    "monthlyListeners": 7800000,
    "verified": true
  },
  {
    "id": "art-8",
    "name": "Depeche Mode",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
    "biography": "Trailblazing English electronic band with deep darkwave and synthpop roots. Known for moody industrial sound designs, baritone vocals, and stadium-sized gothic devotion.",
    "bio": "Trailblazing English electronic band with deep darkwave roots.",
    "genres": [
      "Synthpop",
      "Gothic Darkwave",
      "Industrial"
    ],
    "albums": [
      "alb-8"
    ],
    "monthlyListeners": 15400000,
    "verified": true
  },
  {
    "id": "art-9",
    "name": "Joy Division",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
    "biography": "Seminal post-punk band formed in Salford, Greater Manchester. Defined the bleak, stark, and brooding subterranean resonance of modern dark alternative music.",
    "bio": "Seminal post-punk band formed in Salford, Greater Manchester.",
    "genres": [
      "Post-Punk",
      "Gothic Darkwave",
      "Coldwave"
    ],
    "albums": [
      "alb-9"
    ],
    "monthlyListeners": 6100000,
    "verified": true
  },
  {
    "id": "art-10",
    "name": "Bauhaus",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
    "avatarUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3a/a8/2e/3aa82e19-163a-416a-a745-34d9c665081c/1381.jpg/600x600bb.jpg",
    "biography": "English post-punk band widely recognized as the forebears of gothic rock. Known for theatrical vampire minimalism, jagged post-punk guitars, and Peter Murphy's dramatic baritone.",
    "bio": "English post-punk band widely recognized as the forebears of gothic rock.",
    "genres": [
      "Gothic Rock",
      "Post-Punk",
      "Darkwave"
    ],
    "albums": [
      "alb-10"
    ],
    "monthlyListeners": 1900000,
    "verified": true
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    "id": "pl-1",
    "title": "Gothic Darkwave & Post-Punk",
    "description": "Curated darkwave, post-punk, and alternative metal for deep midnight immersion.",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
    "creator": "Nocturne Sanctuary",
    "createdAt": "2025-01-01",
    "tracksCount": 8,
    "followersCount": 142000,
    "curatedHour": "Midnight - 04:00 AM",
    "tracks": [
      {
        "id": "tr-1",
        "title": "Change (In the House of Flies)",
        "artist": "Deftones",
        "artistId": "art-1",
        "album": "White Pony",
        "albumId": "alb-1",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/a3/cd/86a3cd88-0036-3828-a67b-8174790c0355/mzaf_17335092681325376243.plus.aac.p.m4a",
        "duration": 300,
        "genre": "Alternative Metal",
        "releaseDate": "2000-06-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1852619,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Alternative Metal",
        "lyrics": "Echoes of Change (In the House of Flies) by Deftones.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Deftones]"
          },
          {
            "time": 60,
            "text": "Change (In the House of Flies)"
          },
          {
            "time": 150,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 240,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:1",
        "originalSpotifyId": "tr-1"
      },
      {
        "id": "tr-5",
        "title": "Pictures of You",
        "artist": "The Cure",
        "artistId": "art-2",
        "album": "Disintegration",
        "albumId": "alb-2",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music/b1/d5/c8/mzi.qrmzfpis.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/6d/a4/0d6da426-3f16-7450-c82c-9c35821680b7/mzaf_17899773850184689923.plus.aac.p.m4a",
        "duration": 288,
        "genre": "Gothic Rock",
        "releaseDate": "1990-03-19",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1729635,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Rock",
        "lyrics": "Echoes of Pictures of You by The Cure.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: The Cure]"
          },
          {
            "time": 57,
            "text": "Pictures of You"
          },
          {
            "time": 144,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 230,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:5",
        "originalSpotifyId": "tr-5"
      },
      {
        "id": "tr-9",
        "title": "Apocalypse",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b1/43/b0/b143b0ee-863a-8f7c-3c56-a67110ef1591/mzaf_10438092015459317290.plus.aac.p.m4a",
        "duration": 290,
        "genre": "Dream Pop",
        "releaseDate": "2017-03-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1555755,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of Apocalypse by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 58,
            "text": "Apocalypse"
          },
          {
            "time": 145,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 232,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:9",
        "originalSpotifyId": "tr-9"
      },
      {
        "id": "tr-13",
        "title": "Karma Police",
        "artist": "Radiohead",
        "artistId": "art-4",
        "album": "OK Computer",
        "albumId": "alb-4",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a",
        "duration": 264,
        "genre": "Art Rock",
        "releaseDate": "1997-05-21",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1621264,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Art Rock",
        "lyrics": "Echoes of Karma Police by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Radiohead]"
          },
          {
            "time": 52,
            "text": "Karma Police"
          },
          {
            "time": 132,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 211,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:13",
        "originalSpotifyId": "tr-13"
      },
      {
        "id": "tr-17",
        "title": "Teardrop",
        "artist": "Massive Attack",
        "artistId": "art-5",
        "album": "Mezzanine",
        "albumId": "alb-5",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/a6/91/a3a691b0-8e49-399d-2585-ddcd6694c9f2/mzaf_16325826545413166648.plus.aac.p.m4a",
        "duration": 331,
        "genre": "Trip Hop",
        "releaseDate": "1998-04-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 2240415,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Dark Ambient Drone",
        "lyrics": "Echoes of Teardrop by Massive Attack.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Massive Attack]"
          },
          {
            "time": 66,
            "text": "Teardrop"
          },
          {
            "time": 165,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 264,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:17",
        "originalSpotifyId": "tr-17"
      },
      {
        "id": "tr-22",
        "title": "Nightcall",
        "artist": "Kavinsky",
        "artistId": "art-7",
        "album": "OutRun",
        "albumId": "alb-7",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d2/45/fb/d245fbf9-8570-fdc0-5e6b-aa528c130486/mzaf_11947081694159530687.plus.aac.p.m4a",
        "duration": 258,
        "genre": "Synthwave",
        "releaseDate": "2010-03-26",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1538603,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Coldwave / EBM",
        "lyrics": "Echoes of Nightcall by Kavinsky.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Kavinsky]"
          },
          {
            "time": 51,
            "text": "Nightcall"
          },
          {
            "time": 129,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 206,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:22",
        "originalSpotifyId": "tr-22"
      },
      {
        "id": "tr-24",
        "title": "Enjoy the Silence",
        "artist": "Depeche Mode",
        "artistId": "art-8",
        "album": "Violator",
        "albumId": "alb-8",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/67/9c/a1679c06-1050-239c-bd3a-c374f7c6459e/886449952601.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/ea/96/ebea965e-31b5-b75d-9e9b-260e35a7013c/mzaf_11893712329603215445.plus.aac.p.m4a",
        "duration": 258,
        "genre": "Synthpop",
        "releaseDate": "1990-01-01",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1798503,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Darkwave",
        "lyrics": "Echoes of Enjoy the Silence by Depeche Mode.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Depeche Mode]"
          },
          {
            "time": 51,
            "text": "Enjoy the Silence"
          },
          {
            "time": 129,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 206,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:24",
        "originalSpotifyId": "tr-24"
      },
      {
        "id": "tr-26",
        "title": "Love Will Tear Us Apart",
        "artist": "Joy Division",
        "artistId": "art-9",
        "album": "Substance",
        "albumId": "alb-9",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/bc/99/92/bc9992ae-4e10-e0ea-7b38-b4a9b70f75f6/dj.eoborrdr.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/48/0e/d9480e26-29dc-ce6e-4a18-3b9bc220cb6a/mzaf_15907619936232897096.plus.aac.p.m4a",
        "duration": 206,
        "genre": "Post-Punk",
        "releaseDate": "1980-04-01",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1575582,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Gothic Darkwave",
        "lyrics": "Echoes of Love Will Tear Us Apart by Joy Division.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Joy Division]"
          },
          {
            "time": 41,
            "text": "Love Will Tear Us Apart"
          },
          {
            "time": 103,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 164,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:26",
        "originalSpotifyId": "tr-26"
      }
    ]
  },
  {
    "id": "pl-2",
    "title": "Nocturnal Slowcore & Reverie",
    "description": "Gentle dream pop, ambient drones, and twilight slowcore.",
    "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
    "creator": "Nocturne Sanctuary",
    "createdAt": "2025-01-01",
    "tracksCount": 6,
    "followersCount": 98000,
    "curatedHour": "02:00 - 05:00 AM",
    "tracks": [
      {
        "id": "tr-9",
        "title": "Apocalypse",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b1/43/b0/b143b0ee-863a-8f7c-3c56-a67110ef1591/mzaf_10438092015459317290.plus.aac.p.m4a",
        "duration": 290,
        "genre": "Dream Pop",
        "releaseDate": "2017-03-20",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1555755,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of Apocalypse by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 58,
            "text": "Apocalypse"
          },
          {
            "time": 145,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 232,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:9",
        "originalSpotifyId": "tr-9"
      },
      {
        "id": "tr-10",
        "title": "K.",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/06/ec/9106ec5f-6dad-d8f8-0745-8e3ad98438bb/mzaf_10776239593810001655.plus.aac.p.m4a",
        "duration": 320,
        "genre": "Dream Pop",
        "releaseDate": "2016-12-01",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 2003793,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of K. by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 64,
            "text": "K."
          },
          {
            "time": 160,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 256,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:10",
        "originalSpotifyId": "tr-10"
      },
      {
        "id": "tr-11",
        "title": "Sunsetz",
        "artist": "Cigarettes After Sex",
        "artistId": "art-3",
        "album": "Cigarettes After Sex",
        "albumId": "alb-3",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/5e/0f/b35e0fbe-2370-fc48-0f0c-977525e93bf2/720841214601_Cover.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/a4/4a/44a44a75-0576-12fa-6002-2f464c091102/mzaf_17923299166743083363.plus.aac.p.m4a",
        "duration": 215,
        "genre": "Dream Pop",
        "releaseDate": "2017-06-09",
        "trackNumber": 3,
        "explicit": false,
        "playCount": 1887925,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Midnight Slowcore",
        "lyrics": "Echoes of Sunsetz by Cigarettes After Sex.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Cigarettes After Sex]"
          },
          {
            "time": 43,
            "text": "Sunsetz"
          },
          {
            "time": 107,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 172,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:11",
        "originalSpotifyId": "tr-11"
      },
      {
        "id": "tr-20",
        "title": "When the Sun Hits",
        "artist": "Slowdive",
        "artistId": "art-6",
        "album": "Souvlaki",
        "albumId": "alb-6",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/50/ad/1b50adc8-139b-1ad9-8500-cc2eb93faf17/888880730831.jpg/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8c/d6/29/8cd62943-9c69-3f1b-79b9-fad0883a0e9a/mzaf_9349941370226318512.plus.aac.p.m4a",
        "duration": 286,
        "genre": "Shoegaze",
        "releaseDate": "1993-05-17",
        "trackNumber": 1,
        "explicit": false,
        "playCount": 1514282,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Ethereal Dark Pop",
        "lyrics": "Echoes of When the Sun Hits by Slowdive.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Slowdive]"
          },
          {
            "time": 57,
            "text": "When the Sun Hits"
          },
          {
            "time": 143,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 228,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:20",
        "originalSpotifyId": "tr-20"
      },
      {
        "id": "tr-14",
        "title": "Exit Music (For a Film)",
        "artist": "Radiohead",
        "artistId": "art-4",
        "album": "OK Computer",
        "albumId": "alb-4",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f9/12/e3/f912e3f3-41a6-28f7-251f-dffb260ff0a2/mzaf_563254257801619937.plus.aac.p.m4a",
        "duration": 267,
        "genre": "Art Rock",
        "releaseDate": "1997-05-21",
        "trackNumber": 2,
        "explicit": false,
        "playCount": 1662178,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Art Rock",
        "lyrics": "Echoes of Exit Music (For a Film) by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Radiohead]"
          },
          {
            "time": 53,
            "text": "Exit Music (For a Film)"
          },
          {
            "time": 133,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 213,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:14",
        "originalSpotifyId": "tr-14"
      },
      {
        "id": "tr-15",
        "title": "No Surprises",
        "artist": "Radiohead",
        "artistId": "art-4",
        "album": "OK Computer",
        "albumId": "alb-4",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "audioUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/2a/fa/f02afaad-0a7f-9ceb-1236-55ef3d388061/mzaf_10063872040766906863.plus.aac.p.m4a",
        "duration": 229,
        "genre": "Art Rock",
        "releaseDate": "1997-05-21",
        "trackNumber": 3,
        "explicit": false,
        "playCount": 2280325,
        "bitrate": "24-bit / 96kHz Master",
        "vibe": "Art Rock",
        "lyrics": "Echoes of No Surprises by Radiohead.\nMusic for the hours that belong to you.\nResonating through the silent sanctuary.",
        "syncedLyrics": [
          {
            "time": 0,
            "text": "[Intro: Radiohead]"
          },
          {
            "time": 45,
            "text": "No Surprises"
          },
          {
            "time": 114,
            "text": "Music for the hours that belong to you"
          },
          {
            "time": 183,
            "text": "[Outro - Harmonic fade]"
          }
        ],
        "originalSpotifyUri": "spotify:track:15",
        "originalSpotifyId": "tr-15"
      }
    ]
  }
];
