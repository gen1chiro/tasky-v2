import {FaGithub} from "react-icons/fa"
import {FaTwitter} from "react-icons/fa6"
import {FaLinkedin} from "react-icons/fa6"
import tasky from '../../assets/tasky.png'

const Footer = () => {
    return (
        <footer className="w-full mb-6">
            <div className="flex items-start justify-between w-11/12 max-w-7xl mx-auto py-8">
                <div>
                    <div className='flex items-center gap-2 mb-1'>
                        <div className='flex items-center bg-blue-500 rounded p-[1px]'>
                            <img src={tasky as string} alt="tasky" className='w-4 h-4'/>
                        </div>
                        <h1 className='font-medium'>Tasky</h1>
                    </div>
                    <p className='text-xs text-gray-600'>The smarter way to plan, track, and complete your work.</p>
                </div>
                <div className='flex items-start gap-18'>
                    <div>
                        <h2 className='font-medium pb-1'>Quick Links</h2>
                        <ul className='text-xs text-gray-600 space-y-2'>
                            <li>Product</li>
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className='font-medium pb-1'>Resources</h2>
                        <ul className='text-xs text-gray-600 space-y-2'>
                            <li>Blog</li>
                            <li>Help Center</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className='font-medium pb-1'>Company</h2>
                        <ul className='text-xs text-gray-600 space-y-2'>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className='font-medium pb-1'>Socials</h2>
                        <ul className='text-xs text-gray-600 space-y-2'>
                            <li className='flex items-center gap-2'>
                                <FaGithub className='text-gray-600 hover:text-gray-800 transition-colors duration-200'/>
                                <span>GitHub</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <FaTwitter
                                    className='text-gray-600 hover:text-blue-500 transition-colors duration-200'/>
                                <span>Twitter</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <FaLinkedin
                                    className='text-gray-600 hover:text-blue-700 transition-colors duration-200'/>
                                <span>LinkedIn</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='w-11/12 max-w-7xl mx-auto pt-4 text-xs text-gray-600 flex items-center justify-between'>
                <p>&copy; {new Date().getFullYear()} Tasky. All rights reserved.</p>
                <p>Designed & Developed by <a href='https://github.com/gen1chiro' target='_blank'
                                              className='font-medium text-black'>Jul Leo Javellana</a></p>
            </div>
        </footer>
    )
}

export default Footer