import '../styles/globals.css'
import './app.css'
import Link from 'next/link'




function KryptoBirdMarketplace({Component, pageProps}) {


  return (

        <div>
          <div className='topnav-right'>
        <ul>
          <Link href='/'>
         <li><a>Main Marketplace</a></li>
          </Link>
          <Link href='/mint-item'>
          <li><a>Mint Tokens</a></li>
          </Link>
          <Link href='/my-nfts'>
          <li><a>My NFTs</a></li>
          </Link>
          <Link href='/account-dashboard'>
          <li><a>Account Dashboard</a></li>
          </Link>
          </ul>    

</div>
      <Component {...pageProps} />
    </div>
  )
}

export default KryptoBirdMarketplace

