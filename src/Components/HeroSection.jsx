import CameraField from './CameraField'
import { currentUser } from './data'
import { img1, Profile } from '../assets'
import VolumeControl from '../Hooks/Volume'

function HeroSection() {
    return (
        <div className='px-4 pb-2 bg-gray-100'>
            <div className="container relative h-[60dvh] w-full ">
                {/* TopCOntainer */}
                <div className="flex  justify-between  p-[10px] absolute z-[999] top-0  w-full">
                    {/* userDetails */}

                    {
                        currentUser.map((date, index) => {

                            return (
                                <div className="flex gap-4" key={index}>
                                    <div className="userimage" >
                                        <img
                                            className="w-[50px] h-[50px] rounded-sm border-[2px] border-white object-cover"
                                            src={Profile}
                                            alt="userProfile"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        {/* userName */}
                                        <div className="text-bold text-white">
                                            <h1>{date.name}</h1>
                                        </div>
                                        <div className="text-white text-[13px]">
                                            <p>{date.tag}</p>
                                        </div>
                                    </div>
                                </div>

                            )
                        }
                        )
                    }


                    {/* aiDetails */}
                    <div className=" bg-[#bcc3d0] rounded-[10px] min-h-6 min-w-8 w-[200px]  justify-center p-2 flex gap-2">
                        <img
                            src={img1}
                            className="w-[50px] h-[50px] rounded-sm  object-cover"
                            alt="aiImage" />
                    </div>
                </div>
                <div className="person relative">
                    <CameraField />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-4">
                        <div className='w-full flex-[2] '>
                            <VolumeControl />
                        </div>
                    </div>
                </div>
                {/* volume */}

            </div>
        </div>
    )
}

export default HeroSection


