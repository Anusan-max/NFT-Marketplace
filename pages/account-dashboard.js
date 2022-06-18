


import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import SLNFTMarket from '../artifacts/contracts/SLNFTMarket.sol/SLNFTMarket.json'
import 'bootstrap/dist/css/bootstrap.min.css'



export default function AccountDashBoard() {
    // array of nfts
  const [nfts, setNFTs] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] =  useState('not-loaded')

  useEffect(()=> {
    loadNFts()
  }, [])

  async function loadNFts() {



    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, SLNFTMarket.abi, signer)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)

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


    const soldItems = items.filter(i=> i.sold)
    setSold(soldItems)
    setNFTs(items)
    setLoadingState('loaded')

  }


  if(loadingState == 'loaded' && !nfts.length) return (<h1
    className='px-20 py-7 text-4x1'>You have not minted any NFTs</h1>)


  return (
    <div className='container'>
          <div><h1>Tokens Minted</h1></div>

    <div className='row'>
    <div class='container1'>
          {
            nfts.map((nft, i)=>(
              <div className='col-sm-3'>

              <div class='card'>
              <img class='card-img-top' src={nft.image}/>
                <div class='card-body'>
                  <h4 class="card-title">{nft.name}</h4>
                    <p>{nft.description} and xample text some example text. John Doe is an architect and engineer</p>
                    <a href="#" class="btn btn-primary disabled">{nft.price} ETH</a>
                </div>
              </div>
              </div>    
            ))
          }
</div>
</div>
</div>
  )
}
