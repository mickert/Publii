const AstCurrentSiteConfig = {
    name: '',
    displayName: '',
    synced: false,
    logo: {
        color: '',
        icon: ''
    },
    domain: '',
    language: 'en',
    spellchecking: true,
    advanced: {
        cssCompression: 1,
        htmlCompression: 1,
        htmlCompressionRemoveComments: 1,
        imagesQuality: 60,
        responsiveImages: 1,
        mediaLazyLoad: 1,
        versionSuffix: 1,
        sitemapEnabled: 1,
        sitemapAddTags: 1,
        sitemapAddAuthors: 1,
        sitemapAddHomepage: 1,
        sitemapAddExternalImages: 0,
        sitemapExcludedFiles: '',
        usePageTitleInsteadItemName: false,
        openGraphEnabled: 1,
        openGraphImage: '',
        openGraphAppId: '',
        twitterCardsEnabled: 1,
        twitterCardsType: 'summary',
        twitterUsername: '',
        metaTitle: '%sitename',
        metaDescription: '',
        noIndexThisPage: false,
        homepageNoIndexPagination: false,
        metaRobotsIndex: 'index, follow',
        postMetaTitle: '%posttitle - %sitename ',
        postMetaDescription: '',
        postUseTextWithoutCustomExcerpt: false,
        tagMetaTitle: 'Tag: %tagname - %sitename',
        tagMetaDescription: '',
        tagNoIndexPagination: false,
        tagNoPagination: false,
        metaRobotsTags: 'noindex, follow',
        authorMetaTitle: 'Author: %authorname - %sitename',
        authorMetaDescription: '',
        metaRobotsAuthors: 'noindex, follow',
        authorNoIndexPagination: false,
        authorNoPagination: false,
        displayEmptyAuthors: false,
        displayEmptyTags: false,
        errorMetaTitle: 'Error 404 - %sitename',
        errorMetaDescription: '',
        metaRobotsError: 'noindex, follow',
        searchMetaTitle: 'Search - %sitename',
        searchMetaDescription: '',
        metaRobotsSearch: 'noindex, follow',
        postsListingOrderBy: 'created_at',
        postsListingOrder: 'DESC',
        featuredPostsListingOrderBy: 'created_at',
        featuredPostsListingOrder: 'DESC',
        hiddenPostsListingOrderBy: 'created_at',
        hiddenPostsListingOrder: 'DESC',
        feed: {
            title: 'displayName',
            titleValue: '',
            showFullText: 1,
            numberOfPosts: 10,
            showFeaturedImage: 1,
            enableRss: 1,
            enableJson: 1
        },
        urls: {
            cleanUrls: false,
            addIndex: false,
            tagsPrefix: '',
            authorsPrefix: 'authors',
            pageName: 'page',
            errorPage: '404.html',
            searchPage: 'search.html'
        },
        ampIsEnabled: 0,
        ampPrimaryColor: '#039be5',
        ampImage: '',
        ampShare: 1,
        ampShareSystem: 1,
        ampShareFacebook: 1,
        ampShareFacebookId: '',
        ampShareTwitter: 1,
        ampSharePinterest: 1,
        ampShareLinkedIn: 1,
        ampShareTumblr: 1,
        ampShareWhatsapp: 1,
        ampFooterText: '',
        ampGaId: '',
        customHeadCode: '',
        customHeadAmpCode: '',
        customBodyCode: '',
        customFooterCode: '',
        customFooterAmpCode: '',
        gdpr: {
            enabled: false,
            popupTitlePrimary: 'This website uses cookies',
            popupDesc: 'Select which cookies to opt-in to via the checkboxes below; our website uses cookies to examine site traffic and user activity while on our site, for marketing, and to provide social media functionality.',
            readMoreLinkLabel: 'More details...',
            articleId: 0,
            articleLinkType: 'internal',
            articleExternalUrl: '',
            groups: [
                { 'name': 'Required', 'id': '-' },
                { 'name': 'Functionality', 'id': 'functions' },
                { 'name': 'Analytical', 'id': 'analytics' },
                { 'name': 'Marketing', 'id': 'marketing' }
            ],
            saveButtonLabel: 'Save',
            allowAllButtonLabel: 'Allow all',
            behaviour: 'badge',
            badgeLabel: 'Cookie Policy',
            behaviourLink: '#cookie-settings'
        },
        relatedPostsOrder: 'default',
        relatedPostsCriteria: 'titles-and-tags',
        relatedPostsIncludeAllPosts: true
    },
    deployment: {
        protocol: '',
        relativeUrls: false,
        port: '',
        server: '',
        username: '',
        password: '',
        askforpassword: false,
        rejectUnauthorized: true,
        path: '',
        passphrase: '',
        sftpkey: '',
        s3: {
            id: '',
            key: '',
            bucket: '',
            region: '',
            prefix: '',
            acl: 'public-read'
        },
        github: {
            server: 'api.github.com',
            user: '',
            repo: '',
            branch: '',
            token: '',
            parallelOperations: 1
        },
        gitlab: {
            server: 'https://gitlab.com/',
            repo: '',
            branch: '',
            token: ''
        },
        netlify: {
            id: '',
            token: ''
        },
        google: {
            key: '',
            bucket: '',
            prefix: ''
        },
        manual: {
            output: 'catalog',
            outputDirectory: ''
        }
    }
};

module.exports = AstCurrentSiteConfig;
