import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center">
                <AppLogoIcon className="size-7 text-white dark:text-black" />

                <span className="ml-2 text-lg font-semibold leading-tight truncate">
                    ProgLearn
                 </span>
            </div>

        </>
    );
}
