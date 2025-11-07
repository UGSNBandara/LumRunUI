import AddUserForm from './add-user-form';
// Use path alias to avoid deep relative paths
import { getUsers } from '@/lib/users';

export default async function HomePage() {
  const users = await getUsers();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">LumRun Scoreboard</h1>
        <p className="muted">Top players (high score)</p>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>High Score</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No players yet</td>
                </tr>
              )}
              {users.map((u, i) => (
                <tr key={u._id} className={i===0?'rowTop1': i===1?'rowTop2': i===2?'rowTop3': ''}>
                  <td>{i + 1}</td>
                  <td>{u.username}</td>
                  <td>{u.highScore}</td>
                  <td>{new Date(u.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddUserForm />
      </div>
    </div>
  );
}

export const revalidate = 0; // always dynamic
