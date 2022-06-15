
// we want to load the users nfts and display

import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'



export default function MyAssets() {
    // array of nfts
  const [nfts, setNFTs] = useState([])
  const [loadingState, setLoadingState] =  useState('not-loaded')

  useEffect(()=> {
    loadNFts()
  }, [])

  async function loadNFts() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts


    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // we want to get the token metadata -json
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item;
    }))

    setNFTs(items)
    setLoadingState('loaded')

  }


  if(loadingState == 'loaded' && !nfts.length) return (<h1
    className='px-20 py-7 text-4x1'>You do not own any NFTs currently</h1>)


  return (

    <><div class="row">
      <div class="column">
        <div class="card">..</div>
      </div>
      <div class="column">
        <div class="card">..</div>
      </div>
      <div class="column">
        <div class="card">..</div>
      </div>
      <div class="column">
        <div class="card">..</div>
      </div>
    </div><div class='container1'>
        <div class='card'>
          {nfts.map((nft, i) => (
            <div key={i} class='card-header'>
              <img src={nft.image} width="100%" />
              <div class='card-body'>
                <h4>{nft.name}</h4>
                <div>
                  <p>{nft.description}</p>
                </div>
              </div>
              <div class='user'>

                <tag>{nft.price} ETH</tag>
              </div>

            </div>

          ))}

        </div>
      </div></>

  
  )
}