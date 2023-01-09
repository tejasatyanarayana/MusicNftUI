import React, { useState, useEffect } from 'react'
import web3 from './web3'
import MusicNFT, { abi, address } from './lottery'
import './App.css'
import { useRef } from 'react'
function App() {
  const [owner, setOwner] = useState('')
  const [accounts, setAccounts] = useState([])
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [totalTokens, setTotalTokens] = useState('')
  const [tokenUris, setTokenUris] = useState([])
  const [metaDataList, setMetaDataList] = useState([])
  const [inputValue, setInputValue] = useState('')
  const audioRef = useRef(null)

  function handleInputChange(event) {
    setInputValue(event.target.value)
  }

  function handlePlay() {
    // Play the audio
    audioRef.current.play()
  }
  function stopPlay() {
    // Play the audio
    audioRef.current.pause()
  }
  async function getAllDetails() {
    var acc = await web3.eth.getAccounts()
    var own = await MusicNFT.methods.owner().call()
    var sym = await MusicNFT.methods.symbol().call()
    var nam = await MusicNFT.methods.name().call()
    var totalToken = await MusicNFT.methods.totalTokens().call()
    var uris = await MusicNFT.methods.getTokenUris().call()
    var meta = []
    for (var i = 0; i < uris.length; i++) {
      await fetch(uris[i])
        .then((res) => res.json())
        .then((ress) => meta.push(ress))
    }
    console.log(meta)
    setMetaDataList(meta)
    setTokenUris(uris)
    setTotalTokens(totalToken)
    setAccounts(acc)
    setOwner(own)
    setSymbol(sym)
    setName(nam)
  }

  async function mint(tokenUri) {
    console.log(tokenUri)
    await MusicNFT.methods
      .safeMint('0xDd8e88293F041270a539A3aF6ef358685e4782a7', tokenUri)
      .send({ from: accounts[0] })
  }
  const listenMusic = async(url) => {
    audioRef.current.src = url
    await MusicNFT.methods
    .ListenMusic(1)
    .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') })
    audioRef.current.play()
  }
  // async function listenMusic(tokenID) {
  //   console.log(tokenID)
  //   await MusicNFT.methods
  //     .ListenMusic(1)
  //     .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') })
  //   handlePlay()
  // }

  useEffect(() => {
    getAllDetails()
  }, [])
  return (
    <div style={{ textAlign: 'center', marginTop: '100 px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          style={{
            width: '250px',
            height: '30px',
            border: '1px solid black',
            marginRight: '10px',
            fontSize: '18px',
            marginTop: '10px',
          }}
        />
        <button
          onClick={() => mint(inputValue)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'lightblue',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Mint
        </button>
      </div>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>Owner: {owner}</p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>Symbol: {symbol}</p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>Name: {name}</p>
      <div className="card" style={{ width: '80%', margin: '20px auto' }}>
        <div
          className="card-body"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {metaDataList.map((metaData) => {
            var image = metaData.image
            console.log(image)
            return (
              <div
                style={{
                  display: 'flex',
                  margin: '10px',
                  border: '2px  solid red',
                }}
              >
                <img
                  src={metaData.image}
                  style={{
                    width: '150px',
                    height: '200px',
                    border: '2px solid black',
                  }}
                ></img>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '10px',
                  }}
                >
                  <button
                    onClick={() => listenMusic(metaData.animation_url)}
                    style={{
                      alignSelf: 'center',
                      padding: '10px 20px',
                      fontSize: '16px',
                      marginBottom: '10px',
                    }}
                  >
                    play
                  </button>
                  <button
                    onClick={stopPlay}
                    style={{
                      alignSelf: 'center',
                      padding: '10px 20px',
                      fontSize: '16px',
                    }}
                  >
                    stop
                  </button>
                  <audio src={metaData.animation_url} ref={audioRef}  />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)





  
}
export default App

// https://api.npoint.io/3aa56b6f7c6c44035692
