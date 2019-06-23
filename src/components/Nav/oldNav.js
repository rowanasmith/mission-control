
          <Link className={props.location.pathname === '/home' ? 'active nav-link' : 'nav-link'} to={"/home"}>
          {/* Show this link if they are logged in or not,
      but call this link 'Home' if they are logged in,
      and call this link 'Login / Register' if they are not */}
          {props.user.id ? 'Home' : 'Login / Register'}
        </Link>

        {/* COACH */}
        {props.user.security_clearance === 2 && (
          <>

            <Link className={props.location.pathname === '/missions' ? 'active nav-link' : 'nav-link'} to="/missions">
              View Missions
            </Link>

            <Link className={props.location.pathname === '/home' ? 'active nav-link' : 'nav-link'} to="/home">
              View Teams
            </Link>

            {/* Can't show the following links for coach without getting the team id */}
            {/* <Link className={props.location.pathname === '/history' ? 'active nav-link' : 'nav-link'} to="/history">
          View Runs
        </Link>

        <Link className={props.location.pathname === '/practice-run' ? 'active nav-link' : 'nav-link'} to="/practice-run">
          Create Run
        </Link> */}
          </>
        )}

        {/* TEAM w/o access */}
        {props.user.security_clearance === 3 && (
          <>
            <Link className={props.location.pathname === '/missions' ? 'active nav-link' : 'nav-link'} to="/missions">
              View Missions
        </Link>

            <Link className={props.location.pathname === '/history' ? 'active nav-link' : 'nav-link'} to="/history">
              View Runs
        </Link>
          </>
        )}

        {/* TEAM W/access */}
        {props.user.security_clearance === 4 && (
          <>
            <Link className={props.location.pathname === '/missions' ? 'active nav-link' : 'nav-link'} to="/missions">
              View Missions
            </Link>

            <Link className={props.location.pathname === '/history' ? 'active nav-link' : 'nav-link'} to="/history">
              View Runs
            </Link>

            <Link className={props.location.pathname === '/practice-run' ? 'active nav-link' : 'nav-link'} to="/practice-run">
              Create Run
            </Link>
          </>
        )}