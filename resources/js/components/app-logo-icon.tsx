import logo from '../assets/logo.png';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={logo} alt="App Logo" {...props} />
    
}
