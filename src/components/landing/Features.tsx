import FeatureTile from './FeatureTile'
import feature1 from '../../assets/feature1.png'
import feature2 from '../../assets/feature2.png'
import feature3 from '../../assets/feature3.png'
import feature4 from '../../assets/feature4.png'
import feature5 from '../../assets/feature5.png'

const Features = () => {
    return (
        <div className="w-11/12 max-w-7xl flex flex-col items-center gap-14 pt-14">
            <div className="w-5/6 md:w-1/2 flex flex-col items-center gap-3">
                <p className="w-fit mx-auto px-2 text-center bg-blue-500 text-white text-xs rounded-full">Features</p>
                <h1 className='w-full text-center text-xl md:text-3xl font-medium'>Powerful features to simplify your task
                    management
                    experience.</h1>
            </div>
            <div className="w-full md:w-5/6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FeatureTile aspect="aspect-video">
                    <div className="relative flex-grow overflow-hidden">
                        <img
                            src={feature1 as string}
                            alt="feature"
                            className="rounded-lg border border-b-0 border-gray-200  w-full h-full object-cover"
                        />
                        <div
                            className="absolute bottom-0  w-full h-2/3 bg-gradient-to-t from-slate-50 to-transparent rounded-b-lg"></div>
                    </div>
                    <div>
                        <h2 className='font-medium'>Drag-and-Drop Boards</h2>
                        <p className='text-xs sm:text-sm font-light'>Move tasks effortlessly between columns with our
                            intuitive drag-and-drop interface, keeping your workflow organized and flexible.</p>
                    </div>
                </FeatureTile>
                <FeatureTile aspect="aspect-video">
                    <div className="relative flex-grow overflow-hidden">
                        <img
                            src={feature2 as string}
                            alt="feature"
                            className="rounded-lg border border-b-0 border-gray-200  w-full h-full object-top object-cover"
                        />
                        <div
                            className="absolute bottom-0  w-full h-2/3 bg-gradient-to-t from-slate-50 to-transparent rounded-b-lg"></div>
                    </div>
                    <div>
                        <h2 className='font-medium'>Real-Time Collaboration</h2>
                        <p className='text-xs sm:text-sm font-light'>See updates instantly as teammates move tasks, add
                            comments, or update details — no refresh needed.</p>
                    </div>
                </FeatureTile>
                <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <FeatureTile aspect="apect-video lg:aspect-square">
                        <div className="relative flex-grow overflow-hidden">
                            <img
                                src={feature3 as string}
                                alt="feature"
                                className="rounded-lg border border-b-0 border-gray-200  w-full h-full object-cover"
                            />
                            <div
                                className="absolute bottom-0  w-full h-2/3 bg-gradient-to-t from-slate-50 to-transparent rounded-b-lg"></div>
                        </div>
                        <div>
                            <h2 className='font-medium'>Board Sharing</h2>
                            <p className='text-xs sm:text-sm font-light'>Share boards with teammates or clients in one
                                click.</p>
                        </div>
                    </FeatureTile>
                    <FeatureTile aspect="apect-video lg:aspect-square">
                        <div className="relative flex-grow overflow-hidden">
                            <img
                                src={feature4 as string}
                                alt="feature"
                                className="rounded-lg border border-b-0 border-gray-200  w-full h-full object-left-top object-cover"
                            />
                            <div
                                className="absolute bottom-0  w-full h-2/3 bg-gradient-to-t from-slate-50 to-transparent rounded-b-lg"></div>
                        </div>
                        <div>
                            <h2 className='font-medium'>Customizable Workflows</h2>
                            <p className='text-xs sm:text-sm font-light'>Freely edit boards, tasks, and columns to your
                                project needs.</p>
                        </div>
                    </FeatureTile>
                    <FeatureTile aspect="apect-video lg:aspect-square">
                        <div className="relative flex-grow overflow-hidden">
                            <img
                                src={feature5 as string}
                                alt="feature"
                                className="rounded-lg border border-b-0 border-gray-200 w-full h-full object-cover"
                            />
                            <div
                                className="absolute bottom-0  w-full h-2/3 bg-gradient-to-t from-slate-50 to-transparent rounded-b-lg"></div>
                        </div>
                        <div>
                            <h2 className='font-medium'>Deadline & Priority Tracking</h2>
                            <p className='text-xs sm:text-sm font-light'>Assign due dates and set priorities so
                                important tasks stay visible and on track.</p>
                        </div>
                    </FeatureTile>
                </div>
            </div>
        </div>
    )
}

export default Features