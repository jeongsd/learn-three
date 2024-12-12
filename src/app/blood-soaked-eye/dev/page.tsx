import Image from "next/image";
import img1 from './1.png'
import img2 from './2.png'
import img3 from './3.png'
import img4 from './4.png'
import img5 from './5.png'
import img6 from './6.png'
import img7 from './7.png'
import img8 from './8.png'
import img9 from './9.png'
import result from './result.png'

function Page() {
    return <>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '6353 / 2983' }}>

            <Image src={result} alt="environment" fill />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>기록</h1>
            <a href="https://webbtelescope.org/contents/news-releases/2024/news-2024-136#section-id-2">
                https://webbtelescope.org/contents/news-releases/2024/news-2024-136#section-id-2
            </a>


            <Image src={img1} alt="environment" width="800" />
            <Image src={img2} alt="environment" width="800" />
            <Image src={img3} alt="environment" width="800" />
            <Image src={img4} alt="environment" width="800" />
            <Image src={img5} alt="environment" width="800" />
            <Image src={img6} alt="environment" width="800" />
            <Image src={img7} alt="environment" width="800" />
            <Image src={img8} alt="environment" width="800" />
            <Image src={img9} alt="environment" width="800" />


        </div>
    </>
}

export default Page